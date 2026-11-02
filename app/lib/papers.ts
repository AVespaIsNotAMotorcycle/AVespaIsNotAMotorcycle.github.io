'use client';

import { cached, HOUR, useLoaded } from './github';
import { lookupPaper, titleKey, type Paper } from './openalex';

/**
 * Live paper lookups for talks added since the last build (built ones come
 * from talkPapers.generated.json). Keyless: a key would be public in the
 * page. Keyless requests get a small daily budget per IP address, i.e. per
 * visitor, which covers a few lookups a visit easily.
 */
function cachedPaper(title: string): Promise<Paper | null> {
	// Errors throw, so nothing is cached and the next visit tries again.
	return cached(`openalex-paper-v2:${titleKey(title)}`, 30 * 24 * HOUR, () => lookupPaper(title));
}

/** The paper for each title, keyed by title; titles that can't be resolved are left out. */
export function usePapers(titles: string[]) {
	return useLoaded(`papers:${titles.join('\n')}`, async () => {
		const found: Record<string, Paper> = {};
		for (const title of titles) {
			const paper = await cachedPaper(title).catch(() => null);
			if (paper) found[title] = paper;
		}
		return found;
	});
}
