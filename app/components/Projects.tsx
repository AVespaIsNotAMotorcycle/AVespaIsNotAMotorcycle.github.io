'use client'

import { useState } from 'react';

import Box from './Box';
import Tabs from './Tabs';
import Tab from './Tab';

import fancyFont from '../fancyfont';

import { PROJECTS } from './projects';

type Project = {
	name: string;
	link: string;
	description: string;
}

type DetailProps = {
	title: string;
	content: string;
};
function Detail(props: DetailProps) {
	const { title, content } = props;
	if (!content) return <section />;
	return (
		<section>
			<h4>{title}</h4>
			<p>{content}</p>
		</section>
	);
}

type TagProps = {
	tags: string[];
}
function Tags(props: TagProps) {
	const { tags } = props;
	return (
		<ul className="tags">
			{tags.map((tag) => <li key={tag}>{tag}</li>)}
		</ul>
	);
}

type LinkProps = {
	to: string;
	name: string;
};
function Link(props: LinkProps) {
	const { to, name } = props;
	if (!to) return null;
	if (!name) return null;
	return <a href={to}>{name}</a>;
}

function Project({ project, className }) {
	return (
		<Box section className={`project-card ${className}`}>
			<div className="heading">
				<h3 className={fancyFont.className}>{project.name}</h3>
				<div className="links">
					<Link to={project.link} name="Live app" />
					<Link to={project.repo} name="GitHub repo" />
				</div>
			</div>
			<div>
				<p>{project.description}</p>
			</div>
			<div className="details">
				<section>
					<h4>Problem</h4>
					<p>{project.problem}</p>
				</section>
				<section>
					<h4>Approach</h4>
					<p>{project.approach}</p>
				</section>
				<section>
					<h4>Next Steps</h4>
					<p>{project.outcome}</p>
				</section>
			</div>
			<Tags tags={project.tags} />
		</Box>
	);
}

export default function Projects() {
	const [index, setIndex] = useState(0);
	return (
		<section id="projects" className="projects fullscreen">
			<h2>Projects</h2>
			<div className="content">
				<ul className="project-selection">
					{PROJECTS.map((project, idx) => (
						<li key={project.name}>
							<button onClick={() => { setIndex(idx); }}>
								{project.name}
							</button>
						</li>
					))}
				</ul>
				<div>
					{PROJECTS.map((project, idx) => (
						<Project
							key={project.name}
							className={index == idx ? 'view' : 'hide'}
							project={project}
						/>
					))}
				</div>
			</div>
		</section>
	)
}
