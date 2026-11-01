'use client';

import { GITHUB_USER, READING_GROUP, TALK_NOTES } from '../data';
import { cached, fileAdder, ghJson, HOUR, useLoaded } from './github';

export type Talk = {
	path: string;
	date: string; // YYYY-MM-DD, from the folder name
	title: string;
	/** Full title from the filename, used to look up authors. */
	paperTitle: string;
	/** Hand-written credit from TALK_NOTES; otherwise looked up by `paperTitle`. */
	authors?: string;
	note?: string;
	presenter: string;
	mine: boolean;
	slides: string;
};

/** Talks shown on the page; the rest are a click away in the repo. */
const MAX_TALKS = 8;

const TALK_PATH = /^(\d{4}-\d{2}-\d{2})\/([^/]+)\.pdf$/i;

type Tree = { tree: { path: string; type: string }[] };

/** "Adam_ A Method for Stochastic Optimization-1" → "Adam: A Method for Stochastic Optimization" */
function titleFromFilename(name: string): string {
	return name
		.replace(/-\d+$/, '') // browser "-1" download suffixes
		.replace(/_ /g, ': ') // colons are swapped for underscores in filenames
		.replace(/_/g, ' ')
		.trim();
}

function slidesUrl(path: string): string {
	const encoded = path.split('/').map(encodeURIComponent).join('/');
	return `https://github.com/${GITHUB_USER}/${READING_GROUP}/blob/HEAD/${encoded}`;
}

async function listPdfs(): Promise<{ path: string; date: string; file: string }[]> {
	// The group meets every two weeks, so a daily check is plenty.
	return cached('gh-reading-group-tree-v1', 24 * HOUR, async () => {
		const { body } = await ghJson<Tree>(
			`/repos/${GITHUB_USER}/${READING_GROUP}/git/trees/HEAD?recursive=1`,
		);
		return body.tree.flatMap((entry) => {
			const match = entry.type === 'blob' && entry.path.match(TALK_PATH);
			return match ? [{ path: entry.path, date: match[1], file: match[2] }] : [];
		});
	});
}

async function loadTalks(): Promise<{ talks: Talk[]; total: number }> {
	const pdfs = await listPdfs();
	const newest = [...pdfs]
		.sort((a, b) => b.date.localeCompare(a.date) || a.file.localeCompare(b.file))
		.slice(0, MAX_TALKS);

	const talks = await Promise.all(newest.map(async ({ path, date, file }) => {
		const person = await fileAdder(READING_GROUP, path).catch(() => null);
		const notes = TALK_NOTES[path] ?? {};
		const paperTitle = titleFromFilename(file);
		return {
			path,
			date,
			title: notes.title ?? paperTitle,
			paperTitle,
			authors: notes.authors,
			note: notes.note,
			presenter: person?.name ?? '—',
			mine: person?.login === GITHUB_USER,
			slides: slidesUrl(path),
		};
	}));
	return { talks, total: pdfs.length };
}

export function useTalks() {
	return useLoaded('reading-group', loadTalks);
}

/** "2026-10-05" → "Oct 5" (adds the year when it isn't this year). */
export function formatTalkDate(date: string): string {
	const [y, m, d] = date.split('-').map(Number);
	const day = new Date(Date.UTC(y, m - 1, d));
	return day.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: y === new Date().getFullYear() ? undefined : 'numeric',
		timeZone: 'UTC',
	});
}
