import RepoTable from './components/RepoTable';
import {
	CONTACT,
	EXPERIENCE,
	READING_GROUP_URL,
	TALKS,
} from './data';

export default function Home() {
	return (
		<main className="page">
			<header className="intro">
				<div className="prompt mono">~/sasha-m-ebersole $ cat README.md</div>
				<h1>Sasha Madden Ebersole</h1>
				<p className="lede">
					Software engineer in Seattle. I build neural networks from scratch — my Manchu
					OCR model is a NumPy transformer with hand-written backprop — and I&apos;m moving
					into interpretability research.
				</p>
				<nav aria-label="Contact" className="links mono">
					<a href={`mailto:${CONTACT.email}`}>email</a>
					<a href={CONTACT.github}>github</a>
					<a href={CONTACT.linkedin}>linkedin</a>
					<a href="/resume.pdf">resume.pdf</a>
				</nav>
			</header>

			<section>
				<h2>## Highlight</h2>
				<div className="highlight">
					<h3>Dots and Circles — Manchu OCR</h3>
					<p>
						Trained only on rendered fonts, it reads 73.9% of unseen handwritten words
						exactly — on par with a published CRNN — and 62.3% of photographed print
						(ManchuOCR: 33.3%). Runs ~135 words/s on one CPU core.
					</p>
					<div className="row-links">
						<a href="https://dots-and-circles.sasha-m-ebersole.com/">Try it →</a>
						<a href={`${CONTACT.github}/dots-and-circles`}>Source →</a>
					</div>
				</div>
			</section>

			<section>
				<div className="section-head">
					<h2>## Repos</h2>
					<span className="mono note">live from GitHub</span>
				</div>
				<RepoTable />
			</section>

			<section>
				<h2>## Next</h2>
				<p className="body">
					Fine-tuning Qwen 2.5 into a reasoning model, then comparing its internals
					before and after with the logit and Jacobian lenses.
				</p>
			</section>

			<section>
				<div className="section-head">
					<h2>## Reading group</h2>
					<a href={READING_GROUP_URL} className="mono note-link">all talks + slides →</a>
				</div>
				<p className="body">
					Since August 2026, a few friends and I meet to present ML and CS papers — one
					paper each, every meeting. Every deck is in{' '}
					<a href={READING_GROUP_URL}>reading-group</a>.
				</p>
				<div className="table-scroll">
					<table>
						<thead>
							<tr>
								<th scope="col">date</th>
								<th scope="col">paper</th>
								<th scope="col">presenter</th>
								<th scope="col" className="num">slides</th>
							</tr>
						</thead>
						<tbody>
							{TALKS.map((t) => (
								<tr key={t.slides}>
									<td className="mono muted nowrap">{t.date}</td>
									<td>
										<div className={t.mine ? 'strong' : undefined}>{t.paper}</div>
										<div className="authors">{t.authors}</div>
										{t.link && <div className="mono talk-link">↳ {t.link}</div>}
									</td>
									<td className={t.mine ? 'me' : undefined}>{t.presenter}</td>
									<td className="num mono"><a href={t.slides}>pdf</a></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="mono note">newest first · presenter = GitHub profile name of who added the folder</div>
			</section>

			<section>
				<h2>## Experience</h2>
				<dl className="experience">
					{EXPERIENCE.map((e) => (
						<div key={e.what}>
							<dt className="mono">{e.when}</dt>
							<dd>{e.what}</dd>
						</div>
					))}
				</dl>
			</section>
		</main>
	);
}
