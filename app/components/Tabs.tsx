'use client'

import { createContext, useState } from 'react';

export const TabsContext = createContext();

function TabSelection({ titles, tabSelected, selectTab }) {
	return (
		<ul className="tab-selection">
			{titles.map((title) => (
				<li
					key={title}
					className={tabSelected === title ? 'open' : 'closed'}
				>
					<button
						type="button"
						onClick={() => { selectTab(title); }}
					>
						{title}
					</button>
				</li>
			))}
		</ul>
	);
}

export default function Tabs({ children, className = '', level = 2 }) {
	const [titles, setTitles] = useState([]);
	const [tabSelected, setTabSelected] = useState('');

	const addTitle = (title) => {
		if (titles.includes(title)) return;

		titles.push(title);
		const newTitles = [...titles];
		setTitles(newTitles);

		if (tabSelected === '') setTabSelected(newTitles[0]);
	};

	const selectTab = (title) => {
		setTabSelected(title);
	};

	return (
		<div className={`tabs ${className}`}>
			<TabSelection
				titles={titles}
				tabSelected={tabSelected}
				selectTab={selectTab}
			/>
			<TabsContext.Provider
				value={{
					titles,
					addTitle,
					tabSelected,
				}}
			>
				{children}
			</TabsContext.Provider>
		</div>
	);
}
