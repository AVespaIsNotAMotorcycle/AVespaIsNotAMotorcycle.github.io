/**
 * Paper titles and authors looked up by title on OpenAlex. No imports and no browser
 * APIs, so both the page and the build script (scripts/fetch-talk-papers.mts)
 * can use it.
 */
const OPENALEX_WORKS = 'https://api.openalex.org/works';

type Works = {
	results?: {
		display_name: string | null;
		publication_year: number | null;
		cited_by_count: number;
		authorships: { author: { display_name: string } }[];
	}[];
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** OpenAlex titles sometimes carry <i>, <sub>, … and stray whitespace. */
function cleanTitle(s: string): string {
	return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/** Lowercase letters and digits only, so "Chain-of-Thought" matches "Chain of Thought". */
function squash(s: string): string {
	return cleanTitle(s)
		.normalize('NFKD')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
}

/** Stable cache key for a title. */
export const titleKey = squash;

/** "Jason Wei" → "Wei"; some records (often arXiv's) store "Wei, Jason". */
function lastName(name: string): string {
	if (name.includes(',')) return name.split(',')[0].trim();
	return name.trim().split(/\s+/).pop() ?? name;
}

/** "Kingma & Ba, 2014", "Wei et al., 2022", "Vaswani, 2017" */
export function formatAuthors(names: string[], year: number | null): string | null {
	if (names.length === 0) return null;
	const who =
		names.length === 1 ? lastName(names[0])
		: names.length === 2 ? `${lastName(names[0])} & ${lastName(names[1])}`
		: `${lastName(names[0])} et al.`;
	return year ? `${who}, ${year}` : who;
}

async function searchTitle(title: string, apiKey?: string): Promise<Response> {
	// Commas and colons are syntax in OpenAlex filters, so search on words only.
	const words = title.replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
	const params = new URLSearchParams({
		filter: `title.search:${words}`,
		per_page: '5',
		select: 'display_name,publication_year,cited_by_count,authorships',
	});
	if (apiKey) params.set('api_key', apiKey);
	const url = `${OPENALEX_WORKS}?${params}`;
	for (let attempt = 0; ; attempt++) {
		const res = await fetch(url);
		// Retry rate limits and OpenAlex's intermittent 5xx errors.
		const transient = res.status === 429 || res.status >= 500;
		if (!transient || attempt === 2) return res;
		await sleep(1500 * (attempt + 1));
	}
}

export type Paper = {
	/** The paper's title as OpenAlex has it (see lookupPaper). */
	title: string;
	/** Short author credit, e.g. "Wei et al., 2022"; null if OpenAlex lists none. */
	authors: string | null;
};

/**
 * The paper with this title, or null when no paper with a matching title is
 * found. Throws on network or rate-limit errors.
 * `apiKey` is for the build script only: a key in the page would be public.
 */
export async function lookupPaper(title: string, apiKey?: string): Promise<Paper | null> {
	const res = await searchTitle(title, apiKey);
	if (!res.ok) throw new Error(`OpenAlex ${res.status} for ${title}`);
	const { results = [] } = (await res.json()) as Works;
	// Search returns near misses too; only take a work whose title is ours
	// (filenames may be truncated, so allow a prefix). A paper often has
	// several records (preprint, proceedings); the most-cited is canonical.
	const want = squash(title);
	const matches = results
		.filter((w) => {
			const got = squash(w.display_name ?? '');
			return got.length > 0 && (got.startsWith(want) || want.startsWith(got));
		})
		.sort((a, b) => b.cited_by_count - a.cited_by_count);
	const [paper] = matches;
	if (!paper) return null;
	// Records disagree on capitalization ("Chain-Of-Thought" vs
	// "Chain-of-Thought"), so keep our title when any record spells it
	// exactly that way; otherwise (a truncated or oddly cased filename) take
	// the canonical record's.
	const ours = cleanTitle(title);
	const agrees = matches.some((w) => cleanTitle(w.display_name ?? '') === ours);
	return {
		title: agrees ? ours : cleanTitle(paper.display_name ?? ''),
		authors: formatAuthors(
			paper.authorships.map((a) => a.author.display_name),
			paper.publication_year,
		),
	};
}
