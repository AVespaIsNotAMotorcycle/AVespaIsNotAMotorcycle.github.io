'use client';

import { cached, HOUR, useLoaded } from './github';

/**
 * Paper authors looked up by title on OpenAlex, which allows browser requests.
 * No API key: it would be public in the page. Keyless requests get a small
 * daily budget per IP address, i.e. per visitor, which covers a few lookups a
 * visit easily, and results are cached for a long time.
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

/** Lowercase letters and digits only, so "Chain-of-Thought" matches "Chain of Thought". */
function squash(s: string): string {
	return s
		.replace(/<[^>]*>/g, '') // OpenAlex titles sometimes carry <i>, <sub>, …
		.normalize('NFKD')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
}

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

async function searchTitle(title: string): Promise<Response> {
	// Commas and colons are syntax in OpenAlex filters, so search on words only.
	const words = title.replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
	const url = `${OPENALEX_WORKS}?${new URLSearchParams({
		filter: `title.search:${words}`,
		per_page: '5',
		select: 'display_name,publication_year,cited_by_count,authorships',
	})}`;
	for (let attempt = 0; ; attempt++) {
		const res = await fetch(url);
		if (res.status !== 429 || attempt === 2) return res;
		await sleep(1500 * (attempt + 1));
	}
}

/**
 * Short author credit for the paper with this title, or null when no paper
 * with a matching title is found. Throws (and caches nothing) on network or
 * rate-limit errors, so the next visit tries again.
 */
function lookupAuthors(title: string): Promise<string | null> {
	return cached(`openalex-authors-v1:${squash(title)}`, 30 * 24 * HOUR, async () => {
		const res = await searchTitle(title);
		if (!res.ok) throw new Error(`OpenAlex ${res.status} for ${title}`);
		const { results = [] } = (await res.json()) as Works;
		// Search returns near misses too; only take a work whose title is ours
		// (filenames may be truncated, so allow a prefix). A paper often has
		// several records (preprint, proceedings); the most-cited is canonical.
		const want = squash(title);
		const [paper] = results
			.filter((w) => {
				const got = squash(w.display_name ?? '');
				return got.length > 0 && (got.startsWith(want) || want.startsWith(got));
			})
			.sort((a, b) => b.cited_by_count - a.cited_by_count);
		if (!paper) return null;
		return formatAuthors(
			paper.authorships.map((a) => a.author.display_name),
			paper.publication_year,
		);
	});
}

/** Authors for each title, keyed by title; titles that can't be resolved are left out. */
export function usePaperAuthors(titles: string[]) {
	return useLoaded(`authors:${titles.join('\n')}`, async () => {
		const found: Record<string, string> = {};
		for (const title of titles) {
			const authors = await lookupAuthors(title).catch(() => null);
			if (authors) found[title] = authors;
		}
		return found;
	});
}
