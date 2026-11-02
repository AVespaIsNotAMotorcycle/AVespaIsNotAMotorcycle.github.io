'use client';

import { cached, HOUR, useLoaded } from './github';
import { lookupAuthors, titleKey } from './openalex';

/**
 * Live author lookups for talks added since the last build (built ones come
 * from talkAuthors.generated.json). Keyless: a key would be public in the
 * page. Keyless requests get a small daily budget per IP address, i.e. per
 * visitor, which covers a few lookups a visit easily.
 */
function cachedAuthors(title: string): Promise<string | null> {
	// Errors throw, so nothing is cached and the next visit tries again.
	return cached(`openalex-authors-v1:${titleKey(title)}`, 30 * 24 * HOUR, () => lookupAuthors(title));
}

/** Authors for each title, keyed by title; titles that can't be resolved are left out. */
export function usePaperAuthors(titles: string[]) {
	return useLoaded(`authors:${titles.join('\n')}`, async () => {
		const found: Record<string, string> = {};
		for (const title of titles) {
			const authors = await cachedAuthors(title).catch(() => null);
			if (authors) found[title] = authors;
		}
		return found;
	});
}
