import ReadingGroupTable from './components/ReadingGroup';
import RepoTable from './components/RepoTable';
import ThemeToggle from './components/ThemeToggle';
import {
	CONTACT,
	EXPERIENCE,
	READING_GROUP_URL,
} from './data';

export default function Home() {
	return (
		<main className="page">
			<header className="intro">
				<div className="topbar">
					<div className="prompt mono">~/sasha-m-ebersole $ cat README.md</div>
					<ThemeToggle />
				</div>
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
						92.9% exact-word accuracy on unseen print words (ManchuOCR: 69.2%). With no handwritten words in the training data, it scores
						85.5% on a handwritten set (LLaMA-3.2-11B: 87.4%). Runs ~90 words/s on one CPU core.
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
					Completing BlueDot Impact courses and working through the ARENA curriculum.
				</p>
			</section>

			<section>
				<div className="section-head">
					<h2>## Reading group</h2>
					<a href={READING_GROUP_URL} className="mono note-link">all slides →</a>
				</div>
				<p className="body">
					Since August 2026, a few friends and I have met to present ML and CS papers
					every few weeks. Every deck is in{' '}
					<a href={READING_GROUP_URL}>reading-group</a>.
				</p>
				<ReadingGroupTable />
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
