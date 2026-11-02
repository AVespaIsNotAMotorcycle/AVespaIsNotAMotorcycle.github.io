/** How talk PDFs are laid out in the reading-group repo. Shared with scripts/. */

/** `YYYY-MM-DD/<paper title>.pdf` */
export const TALK_PATH = /^(\d{4}-\d{2}-\d{2})\/([^/]+)\.pdf$/i;

/** "Adam_ A Method for Stochastic Optimization-1" → "Adam: A Method for Stochastic Optimization" */
export function titleFromFilename(name: string): string {
	return name
		.replace(/-\d+$/, '') // browser "-1" download suffixes
		.replace(/_ /g, ': ') // colons are swapped for underscores in filenames
		.replace(/_/g, ' ')
		.trim();
}
