type Project = {
	name: string;
	link: string;
	description: string;
}
const PROJECTS = [
	{
		name: "Dots and Circles",
		link: "http://dots-and-circles.sasha-m-ebersole.com/",
		description: "Dots and Circles is my first non-tutorial machine learning project. It is an app for optical character recognition of Manchu-language text."
	},
	{
		name: "Raschka LLM",
		link: "http://raschka.sasha-m-ebersole.com/",
		description: "A GPT-style LLM created by working through Sebastian Raschka's book 'How to Build a Large Language Model (From Scratch)'",
	},
];

function Projects() {
	return (
		<ul>
			{PROJECTS.map((project) => (
				<li key={project.name}>
					<a href={project.link}>{project.name}</a>
					{': '}{project.description}
				</li>
			))}
		</ul>
	)
}

type ContactMethod = {
	link: string;
	name: string;
};
const CONTACT = [
	{
		link: 'mailto:sasha.m.ebersole@gmail.com',
		name: 'sasha.m.ebersole@gmail.com',
	},
	{
		link: 'https://github.com/AVespaIsNotAMotorcycle',
		name: 'GitHub'
	},
	{
		link: 'https://www.linkedin.com/in/sasha-ebersole-481a39257/',
		name: "LinkedIn",
	},
];

function Address() {
	return (
		<address>
			{CONTACT.map((method) => (
				<a key={method.name} href={method.link}>{method.name}</a>
			))}
		</address>
	);
}

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
