export const GITHUB_USER = 'AVespaIsNotAMotorcycle';

export const CONTACT = {
	email: 'sasha.m.ebersole@gmail.com',
	github: `https://github.com/${GITHUB_USER}`,
	linkedin: 'https://www.linkedin.com/in/sasha-ebersole-481a39257/',
};

export type Repo = {
	name: string;
	description: string;
	/** Shown until the live count loads from GitHub (or if it can't). */
	fallbackCommits: number;
};

export const REPOS: Repo[] = [
	{
		name: 'dots-and-circles',
		description: 'Dots and Circles is an app for optical character recognition of Manchu-language text, using a transformer architecture coded from scratch with NumPy matrices.',
		fallbackCommits: 371,
	},
	{
		name: 'Raschka-LLM',
		description: 'Working through "Build a Large Language Model (From Scratch)" by Sebastian Raschka',
		fallbackCommits: 24,
	},
];

const READING_GROUP = `${CONTACT.github}/reading-group`;
export const READING_GROUP_URL = READING_GROUP;

export type Talk = {
	date: string;
	paper: string;
	authors: string;
	link?: string;
	presenter: string;
	mine?: boolean;
	slides: string;
};

/** Newest first. */
export const TALKS: Talk[] = [
	{
		date: 'Oct 19',
		paper: 'An Image is Worth 16x16 Words',
		authors: 'Dosovitskiy et al., 2020 · ViT',
		presenter: 'Sasha Ebersole',
		mine: true,
		slides: `${READING_GROUP}/blob/main/2026-10-19/An%20Image%20is%20Worth%2016x16%20Words_%20Transformers%20for%20Image%20Recognition%20at%20Scale.pdf`,
	},
	{
		date: 'Oct 5',
		paper: 'Adam: A Method for Stochastic Optimization',
		authors: 'Kingma & Ba, 2014',
		link: 'implemented by hand in Dots and Circles',
		presenter: 'Sasha Ebersole',
		mine: true,
		slides: `${READING_GROUP}/blob/main/2026-10-05/Adam_%20A%20Method%20for%20Stochastic%20Optimization.pdf`,
	},
	{
		date: 'Sep 14',
		paper: 'Chain-of-Thought Prompting Elicits Reasoning in LLMs',
		authors: 'Wei et al., 2022',
		link: 'background for my reasoning fine-tune',
		presenter: 'Sasha Ebersole',
		mine: true,
		slides: `${READING_GROUP}/blob/main/2026-09-14/Chain-of-Thought%20Prompting%20Elicits%20Reasoning%20in%20Large%20Language%20Models-1.pdf`,
	},
];

export const EXPERIENCE: { when: string; what: string }[] = [
	{ when: '2026–', what: 'AI Trainer, DataAnnotation — evaluating coding agents' },
	{ when: '2022–24', what: 'Partner & Frontend Developer, DataMixMaster' },
	{ when: '2023', what: 'Full-Stack Developer, Groenewold IT Solutions' },
	{ when: '2022', what: 'B.A. Computer Science & History, Hunter College' },
];
