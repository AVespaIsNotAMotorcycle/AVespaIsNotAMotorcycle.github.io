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

export default function Projects() {
	return (
		<section>
			<h2>Projects</h2>
			<ul>
				{PROJECTS.map((project) => (
					<li key={project.name}>
						<a href={project.link}>{project.name}</a>
						{': '}{project.description}
					</li>
				))}
			</ul>
		</section>
	)
}
