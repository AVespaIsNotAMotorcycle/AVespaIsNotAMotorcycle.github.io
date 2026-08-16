import Projects from './Projects';
import Address from './Address';

export default function Home() {
  return (
		<main>
			<section>
				<h1>Sasha Madden Ebersole</h1>
				<Address />
			</section>
			<section>
				<h2>About Sasha</h2>
				<p>
					Sasha is a current deli clerk and aspiring machine learning engineer
					living in Seattle, Washington. In the past they have worked as a
					frontend developer at a startup, DataMixMaster, and as a full-stack
					developer at an IT contractor, Groenewold IT Solutions. They speak
					fluent English and competent German. Their Spanish isn't great. They
					have a Bachelor's in Computer Science and History from Hunter College.
					Outside of work they like to read about late imperial Chinese history,
					train Muay Thai, write poetry and short fiction, and draw.
				</p>
			</section>
			<section>
				<h2>Projects</h2>
				<Projects />
			</section>
		</main>
  );
}
