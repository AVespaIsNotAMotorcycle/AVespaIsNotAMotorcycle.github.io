import Projects from './Projects';
import Address from './Address';
import About from './About';

export default function Home() {
  return (
		<main>
			<section>
				<h1>Sasha Madden Ebersole</h1>
				<p>
					Aspiring ML engineer with experience in frontend and full-stack web
					development.
				</p>
				<Address />
			</section>
			<About />
			<Projects />
		</main>
  );
}
