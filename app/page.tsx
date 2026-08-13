const PROJECTS = {
	dotsAndCircles: {
		name: "Dots and Circles",
		link: "http://dots-and-circles.sasha-m-ebersole.com/",
		description: "Dots and Circles is my first non-tutorial machine learning project. It is an app for optical character recognition of Manchu-language text."
	},
	raschka: {
		name: "Raschka LLM",
		link: "http://raschka.sasha-m-ebersole.com/",
		description: "A GPT-style LLM created by working through Sebastian Raschka's book 'How to Build a Large Language Model (From Scratch)'",
	},
};

function Projects() {
	return (
		<ul>
			{Object.keys(PROJECTS).map((key) => (
				<li key={key}>
					<a href={PROJECTS[key].link}>{PROJECTS[key].name}</a>
					{': '}{PROJECTS[key].description}
				</li>
			))}
		</ul>
	)
}

export default function Home() {
  return (
		<main>
			<h1>Sasha Madden Ebersole</h1>
			<section>
				<h2>About Sasha</h2>
				<p>
					Sasha is a current deli clerk and aspiring machine learning engineer.
					In the past they have worked as a frontend developer at a startup
					called DataMixMaster and as a full-stack developer at an IT contractor
					called Groenewold IT Solutions. They speak fluent English and competent
					German. Their Spanish isn't great. They have a Bachelor's in Computer
					Science and History from Hunter College. Outside of work they like to
					read about late imperial Chinese history, train Muay Thai, write poetry
					and short fiction, and draw.
				</p>
			</section>
			<section>
				<h2>Projects</h2>
				<Projects />
			</section>
		</main>
  );
}
