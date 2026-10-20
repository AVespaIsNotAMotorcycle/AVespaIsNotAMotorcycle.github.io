import Projects from './components/Projects';
import fancyFont from './fancyfont';

export default function Home() {
	return (
		<main className="homepage">
			<div className="homepage fullscreen">
				<section>
					<h1>Sasha Madden Ebersole</h1>
					<p>
						Design driven by curiosity.
						Let me learn with you.
					</p>
				</section>
				<nav>
					<ul className={fancyFont.className}>
						<li><a href="#projects">Projects</a></li>
						<li><a href="#about">About</a></li>
						<li><a href="#contact">Contact</a></li>
					</ul>
				</nav>
			</div>
			<Projects />
			<section id="about" className="fullscreen">
				<h2 className={fancyFont.className}>About</h2>
			</section>
			<section id="contact" className="fullscreen">
				<h2 className={fancyFont.className}>Contact</h2>
			</section>
		</main>
	);
}
