import Projects from './components/Projects';
import Address from './components/Address';
import About from './components/About';
import Box from './components/Box';
import DotWaveBackground from './components/DotWaveBackground';

export default function Home() {
  return (
		<main>
			<DotWaveBackground />
			<Box>
				<section>
					<h1>Sasha Madden Ebersole</h1>
					<p>
						Aspiring ML engineer with experience in frontend
						and full-stack web development.
					</p>
					<Address />
				</section>
			</Box>
			<About />
			<Projects />
		</main>
  );
}
