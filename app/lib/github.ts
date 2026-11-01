'use client';

import { useEffect, useState } from 'react';

import { GITHUB_USER } from '../data';

export type RepoInfo = {
	commitCount: number | null;
	lastCommit: string | null;
};

type State =
	| { status: 'loading' }
	| { status: 'error' }
	| { status: 'ready'; repos: Record<string, RepoInfo> };

const CACHE_KEY = 'gh-repos-v1';
const CACHE_TTL = 60 * 60 * 1000; // one hour

type ApiCommit = {
	commit: { author: { date: string } | null; committer: { date: string } | null };
};

/**
 * One request per repo: a per_page=1 commit listing gives the newest commit,
 * and its `rel="last"` page number is the total commit count.
 */
async function fetchRepo(repo: string): Promise<RepoInfo> {
	const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}/commits?per_page=1`);
	if (!res.ok) throw new Error(`GitHub ${res.status}`);
	const body: ApiCommit[] = await res.json();
	const last = res.headers.get('link')?.match(/[?&]page=(\d+)>; rel="last"/);
	const newest = body[0]?.commit;
	return {
		commitCount: last ? Number(last[1]) : body.length,
		lastCommit: newest?.committer?.date ?? newest?.author?.date ?? null,
	};
}

function readCache(key: string): Record<string, RepoInfo> | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const cached = JSON.parse(raw);
		if (cached.key !== key || Date.now() - cached.at > CACHE_TTL) return null;
		return cached.repos;
	} catch {
		return null;
	}
}

function writeCache(key: string, repos: Record<string, RepoInfo>) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ key, at: Date.now(), repos }));
	} catch {
		// storage unavailable; skip caching
	}
}

async function load(names: string[]): Promise<Record<string, RepoInfo>> {
	const key = names.join(',');
	const cached = readCache(key);
	if (cached) return cached;
	const infos = await Promise.all(names.map(fetchRepo));
	const repos = Object.fromEntries(names.map((n, i) => [n, infos[i]]));
	writeCache(key, repos);
	return repos;
}

export function useRepoInfo(names: string[]): State {
	const [state, setState] = useState<State>({ status: 'loading' });
	const key = names.join(',');
	useEffect(() => {
		let alive = true;
		load(key.split(','))
			.then((repos) => { if (alive) setState({ status: 'ready', repos }); })
			.catch(() => { if (alive) setState({ status: 'error' }); });
		return () => { alive = false; };
	}, [key]);
	return state;
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
