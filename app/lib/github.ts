'use client';

import { useEffect, useState } from 'react';

import { GITHUB_USER } from '../data';

export const API = 'https://api.github.com';

export const HOUR = 60 * 60 * 1000;

export type Loaded<T> =
	| { status: 'loading' }
	| { status: 'error' }
	| { status: 'ready'; data: T };

export async function ghJson<T>(path: string): Promise<{ body: T; res: Response }> {
	const res = await fetch(`${API}${path}`);
	if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`);
	return { body: await res.json(), res };
}

/** Runs `fn` at most once per `ttl` per browser, keeping the result in localStorage. */
export async function cached<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
	try {
		const raw = localStorage.getItem(key);
		if (raw) {
			const { at, value } = JSON.parse(raw);
			if (Date.now() - at < ttl) return value;
		}
	} catch {
		// unreadable cache; fetch fresh
	}
	const value = await fn();
	try {
		localStorage.setItem(key, JSON.stringify({ at: Date.now(), value }));
	} catch {
		// storage unavailable; skip caching
	}
	return value;
}

/** Loads `fn` once on mount (and again when `key` changes). */
export function useLoaded<T>(key: string, fn: () => Promise<T>): Loaded<T> {
	const [state, setState] = useState<Loaded<T>>({ status: 'loading' });
	useEffect(() => {
		let alive = true;
		fn()
			.then((data) => { if (alive) setState({ status: 'ready', data }); })
			.catch(() => { if (alive) setState({ status: 'error' }); });
		return () => { alive = false; };
		// fn is re-created each render; key identifies what it loads
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);
	return state;
}

/* === Repo stats === */

export type RepoInfo = {
	commitCount: number | null;
	lastCommit: string | null;
};

type ApiCommit = {
	author: { login: string } | null;
	commit: {
		author: { name: string; date: string } | null;
		committer: { date: string } | null;
	};
};

/**
 * One request per repo: a per_page=1 commit listing gives the newest commit,
 * and its `rel="last"` page number is the total commit count.
 */
async function fetchRepo(repo: string): Promise<RepoInfo> {
	const { body, res } = await ghJson<ApiCommit[]>(
		`/repos/${GITHUB_USER}/${repo}/commits?per_page=1`,
	);
	const last = res.headers.get('link')?.match(/[?&]page=(\d+)>; rel="last"/);
	const newest = body[0]?.commit;
	return {
		commitCount: last ? Number(last[1]) : body.length,
		lastCommit: newest?.committer?.date ?? newest?.author?.date ?? null,
	};
}

export function useRepoInfo(names: string[]): Loaded<Record<string, RepoInfo>> {
	const key = names.join(',');
	return useLoaded(key, () => cached(`gh-repos-v2:${key}`, HOUR, async () => {
		const infos = await Promise.all(names.map(fetchRepo));
		return Object.fromEntries(names.map((n, i) => [n, infos[i]]));
	}));
}

/* === Commit authors === */

export type Person = { login: string | null; name: string };

/** Who made the oldest commit touching `path` in `repo`, i.e. who added it. */
export function fileAdder(repo: string, path: string): Promise<Person> {
	// Who added a file never changes, so this is cached for a long time.
	return cached(`gh-adder-v1:${repo}/${path}`, 30 * 24 * HOUR, async () => {
		const query = new URLSearchParams({ path, per_page: '100' });
		const { body } = await ghJson<ApiCommit[]>(
			`/repos/${GITHUB_USER}/${repo}/commits?${query}`,
		);
		const oldest = body[body.length - 1];
		if (!oldest) throw new Error(`no commits for ${path}`);
		const login = oldest.author?.login ?? null;
		const gitName = oldest.commit.author?.name ?? 'unknown';
		return { login, name: login ? await profileName(login) : gitName };
	});
}

/** A user's GitHub profile name, falling back to their login. */
function profileName(login: string): Promise<string> {
	return cached(`gh-user-v1:${login}`, 7 * 24 * HOUR, async () => {
		const { body } = await ghJson<{ name: string | null }>(`/users/${login}`);
		return body.name?.trim() || login;
	});
}

export function timeAgo(iso: string): string {
	const then = new Date(iso).getTime();
	if (Number.isNaN(then)) return '';
	const days = Math.floor((Date.now() - then) / 86_400_000);
	if (days <= 0) return 'today';
	if (days === 1) return 'yesterday';
	if (days < 30) return `${days}d ago`;
	const months = Math.round(days / 30);
	if (months < 12) return `${months}mo ago`;
	return `${Math.round(months / 12)}y ago`;
}
