/**
 * Pre-build: looks up each paper in the reading-group repo on OpenAlex (its
 * title as OpenAlex has it, and its authors) and saves them to
 * app/talkPapers.generated.json, so the page has them on load. Talks whose
 * title and authors are both hand-written in TALK_NOTES are skipped. Talks added
 * after the build are still looked up live in the browser.
 *
 * Entries already in the file are kept, not looked up again; delete one to
 * refresh it. Entries for PDFs no longer in the repo are dropped.
 *
 * Never fails the build: if GitHub or OpenAlex can't be reached, it warns and
 * keeps what it has (those talks fall back to the live lookup).
 *
 * Env (both optional, never shipped in the page):
 *   OPENALEX_API_KEY  own daily budget instead of the shared keyless one
 *   GITHUB_TOKEN      higher GitHub rate limit for listing the repo
 *
 * Run: npm run fetch-papers
 */
import { readFile, writeFile } from 'node:fs/promises';

import { GITHUB_USER, READING_GROUP, TALK_NOTES } from '../app/data.ts';
import { lookupPaper, type Paper } from '../app/lib/openalex.ts';
import { TALK_PATH, titleFromFilename } from '../app/lib/talkFiles.ts';

const OUT = new URL('../app/talkPapers.generated.json', import.meta.url);

async function listTalkPdfs(): Promise<{ path: string; title: string }[]> {
	const token = process.env.GITHUB_TOKEN;
	const res = await fetch(
		`https://api.github.com/repos/${GITHUB_USER}/${READING_GROUP}/git/trees/HEAD?recursive=1`,
		{ headers: token ? { Authorization: `Bearer ${token}` } : {} },
	);
	if (!res.ok) throw new Error(`GitHub ${res.status}`);
	const { tree } = (await res.json()) as { tree: { path: string; type: string }[] };
	return tree.flatMap((entry) => {
		const match = entry.type === 'blob' && entry.path.match(TALK_PATH);
		return match ? [{ path: entry.path, title: titleFromFilename(match[2]) }] : [];
	});
}

async function readExisting(): Promise<Record<string, unknown>> {
	try {
		return JSON.parse(await readFile(OUT, 'utf8'));
	} catch {
		return {};
	}
}

/** Entries from before titles were stored are bare author strings; look those up again. */
const isPaper = (v: unknown): v is Paper => typeof v === 'object' && v !== null && 'title' in v;

async function main() {
	const apiKey = process.env.OPENALEX_API_KEY || undefined;
	const existing = await readExisting();

	let pdfs;
	try {
		pdfs = await listTalkPdfs();
	} catch (err) {
		console.warn(`fetch-papers: couldn't list ${READING_GROUP} (${(err as Error).message}); keeping existing papers`);
		return;
	}

	const out: Record<string, Paper> = {};
	let added = 0;
	for (const { path, title } of pdfs) {
		const notes = TALK_NOTES[path];
		if (notes?.title && notes.authors) continue; // hand-written wins
		const kept = existing[path];
		if (isPaper(kept)) {
			out[path] = kept;
			continue;
		}
		try {
			const paper = await lookupPaper(title, apiKey);
			if (paper) {
				out[path] = paper;
				added++;
				console.log(`fetch-papers: ${title} → "${paper.title}", ${paper.authors ?? 'no authors'}`);
			} else {
				console.warn(`fetch-papers: no OpenAlex match for "${title}"; add title and authors to TALK_NOTES`);
			}
		} catch (err) {
			console.warn(`fetch-papers: lookup failed for "${title}" (${(err as Error).message}); will retry next build`);
		}
	}

	const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => b.localeCompare(a)));
	const json = `${JSON.stringify(sorted, null, '\t')}\n`;
	if (json !== `${JSON.stringify(existing, null, '\t')}\n`) {
		await writeFile(OUT, json);
	}
	console.log(`fetch-papers: ${Object.keys(sorted).length} papers found (${added} new)`);
}

await main();
