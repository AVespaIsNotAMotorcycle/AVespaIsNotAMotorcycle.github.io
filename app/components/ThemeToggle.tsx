'use client';

import { useSyncExternalStore } from 'react';

export const THEME_KEY = 'theme';

type Theme = 'light' | 'dark';

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

/** The theme in effect: the saved choice on <html data-theme>, else the system's. */
function currentTheme(): Theme {
	const set = document.documentElement.dataset.theme;
	if (set === 'light' || set === 'dark') return set;
	return darkQuery().matches ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	const query = darkQuery();
	query.addEventListener('change', onChange);
	return () => {
		observer.disconnect();
		query.removeEventListener('change', onChange);
	};
}

export default function ThemeToggle() {
	// null while server-rendering; the icons switch by CSS, so nothing flickers.
	const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

	const toggle = () => {
		const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem(THEME_KEY, next);
		} catch {
			// storage unavailable; the choice lasts until reload
		}
	};

	return (
		<button
			type="button"
			className="theme-toggle"
			onClick={toggle}
			aria-label="Dark mode"
			aria-pressed={theme === null ? undefined : theme === 'dark'}
		>
			<svg className="icon-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
				<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
			</svg>
			<svg className="icon-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
			</svg>
		</button>
	);
}
