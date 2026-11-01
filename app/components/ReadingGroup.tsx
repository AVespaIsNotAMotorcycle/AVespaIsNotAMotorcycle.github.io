'use client';

import { READING_GROUP_URL } from '../data';
import { usePaperAuthors } from '../lib/papers';
import { formatTalkDate, useTalks } from '../lib/readingGroup';

export default function ReadingGroupTable() {
	const state = useTalks();
	// Authors load after the table, so a slow lookup never holds up the talk list.
	const toLookUp = state.status === 'ready'
		? state.data.talks.filter((t) => !t.authors).map((t) => t.paperTitle)
		: [];
	const lookedUp = usePaperAuthors(toLookUp);
	const authorsOf = (t: { authors?: string; paperTitle: string }) =>
		t.authors ?? (lookedUp.status === 'ready' ? lookedUp.data[t.paperTitle] : undefined);

	if (state.status === 'error') {
		return (
			<p className="body">
				Couldn&apos;t load the talk list from GitHub just now —{' '}
				<a href={READING_GROUP_URL}>see every talk in the repo</a>.
			</p>
		);
	}

	const talks = state.status === 'ready' ? state.data.talks : null;
	const hidden = state.status === 'ready' ? state.data.total - state.data.talks.length : 0;

	return (
		<>
			<div className="table-scroll">
				<table aria-busy={talks === null}>
					<thead>
						<tr>
							<th scope="col">date</th>
							<th scope="col">paper</th>
							<th scope="col">presenter</th>
							<th scope="col" className="num">slides</th>
						</tr>
					</thead>
					<tbody>
						{talks === null && [0, 1, 2].map((i) => (
							<tr key={i}>
								<td><span className="skeleton" style={{ width: 48 }} /></td>
								<td><span className="skeleton" style={{ width: '70%' }} /></td>
								<td><span className="skeleton" style={{ width: 96 }} /></td>
								<td className="num"><span className="skeleton" style={{ width: 24, marginLeft: 'auto' }} /></td>
							</tr>
						))}
						{talks?.map((t) => (
							<tr key={t.path}>
								<td className="mono muted nowrap">
									<time dateTime={t.date}>{formatTalkDate(t.date)}</time>
								</td>
								<td>
									<div className={t.mine ? 'strong' : undefined}>{t.title}</div>
									{authorsOf(t) && <div className="authors">{authorsOf(t)}</div>}
									{t.note && <div className="mono talk-link">↳ {t.note}</div>}
								</td>
								<td className={t.mine ? 'me' : undefined}>{t.presenter}</td>
								<td className="num mono"><a href={t.slides}>pdf</a></td>
							</tr>
						))}
						{talks?.length === 0 && (
							<tr><td colSpan={4} className="muted">No talks posted yet.</td></tr>
						)}
					</tbody>
				</table>
			</div>
			<div className="mono note">
				newest first · presenter = GitHub profile name of who added the slides
				{hidden > 0 && <> · <a href={READING_GROUP_URL}>{hidden} older</a></>}
			</div>
		</>
	);
}
