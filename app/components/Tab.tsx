'use client'

import { useContext, useEffect } from 'react';

import { TabsContext } from './Tabs';

function TabTitle({ title, level }) {
	switch (level) {
		case 6: return <h3 className="tab-title">{title}</h3>;
		case 5: return <h3 className="tab-title">{title}</h3>;
		case 4: return <h3 className="tab-title">{title}</h3>;
		case 3: return <h3 className="tab-title">{title}</h3>;
		default: return <h2 className="tab-title">{title}</h2>;
	}
}

export default function Tab({ title, children, level = 2 }) {
	const { titles, tabSelected, addTitle } = useContext(TabsContext);
	const isOpen = tabSelected == title;

	useEffect(() => {
		if (titles.includes(title)) return;
		addTitle(title);
	}, [titles])

	return (
		<section className={`tab ${isOpen ? 'open' : 'closed'}`}>
			<TabTitle title={title} level={level} />
			{children}
		</section>
	)
}
