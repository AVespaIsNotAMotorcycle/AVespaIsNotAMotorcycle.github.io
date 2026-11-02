export const GITHUB_USER = 'AVespaIsNotAMotorcycle';

export const CONTACT = {
	email: 'sasha.m.ebersole@gmail.com',
	github: `https://github.com/${GITHUB_USER}`,
	linkedin: 'https://www.linkedin.com/in/sasha-m-ebersole/',
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

/**
 * The reading-group repo: every `YYYY-MM-DD/<paper title>.pdf` in it becomes
 * a talk on the page, presented by whoever committed that PDF.
 */
export const READING_GROUP = 'reading-group';
export const READING_GROUP_URL = `${CONTACT.github}/${READING_GROUP}`;

export type TalkNotes = {
	/** Replaces the title read from the PDF's filename. */
	title?: string;
	/** Replaces the authors looked up on OpenAlex by the paper's title. */
	authors?: string;
	/** Shown under the paper as "↳ …". */
	note?: string;
};

/**
 * Optional hand-written extras for talks, keyed by the PDF's path in the repo.
 * Talks without an entry still show, titled from their filename, with
 * authors looked up by that title.
 */
export const TALK_NOTES: Record<string, TalkNotes> = {
	'2026-10-19/An Image is Worth 16x16 Words_ Transformers for Image Recognition at Scale.pdf': {
		title: 'An Image is Worth 16x16 Words',
		authors: 'Dosovitskiy et al., 2020 · ViT',
	},
	'2026-10-05/Adam_ A Method for Stochastic Optimization.pdf': {
		note: 'implemented by hand in Dots and Circles',
	},
	'2026-09-14/Chain-of-Thought Prompting Elicits Reasoning in Large Language Models-1.pdf': {
		title: 'Chain-of-Thought Prompting Elicits Reasoning in LLMs',
		note: 'background for my reasoning fine-tune',
	},
};

export const EXPERIENCE: { when: string; what: string }[] = [
	{ when: '2026–', what: 'AI Trainer, DataAnnotation — evaluating coding agents' },
	{ when: '2022–24', what: 'Partner & Frontend Developer, DataMixMaster' },
	{ when: '2023', what: 'Full-Stack Developer, Groenewold IT Solutions' },
	{ when: '2022', what: 'B.A. Computer Science & History, Hunter College' },
];
