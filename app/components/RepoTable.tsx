'use client';

import { CONTACT, REPOS } from '../data';
import { timeAgo, useRepoInfo } from '../lib/github';

const NAMES = REPOS.map((r) => r.name);

export default function RepoTable() {
	const state = useRepoInfo(NAMES);

	return (
		<div className="table-scroll">
			<table>
				<thead>
					<tr>
						<th scope="col">repo</th>
						<th scope="col">description</th>
						<th scope="col" className="num">commits</th>
						<th scope="col" className="num">pushed</th>
					</tr>
				</thead>
				<tbody>
					{REPOS.map((repo) => {
						const info = state.status === 'ready' ? state.repos[repo.name] : undefined;
						const pushed = info?.lastCommit;
						return (
							<tr key={repo.name}>
								<td className="mono strong">
									<a href={`${CONTACT.github}/${repo.name}`}>{repo.name}</a>
								</td>
								<td className="desc">{repo.description}</td>
								<td className="num mono">{info?.commitCount ?? repo.fallbackCommits}</td>
								<td className="num mono muted">
									{pushed ? <time dateTime={pushed}>{timeAgo(pushed)}</time> : '—'}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
