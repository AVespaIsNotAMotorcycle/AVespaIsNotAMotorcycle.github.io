type ContactMethod = {
	link: string;
	name: string;
};
const CONTACT = [
	{
		link: 'mailto:sasha.m.ebersole@gmail.com',
		name: 'sasha.m.ebersole@gmail.com',
	},
	{
		link: 'https://github.com/AVespaIsNotAMotorcycle',
		name: 'GitHub'
	},
	{
		link: 'https://www.linkedin.com/in/sasha-ebersole-481a39257/',
		name: "LinkedIn",
	},
];

export default function Address() {
	return (
		<address>
			{CONTACT.map((method) => (
				<a key={method.name} href={method.link}>{method.name}</a>
			))}
		</address>
	);
}
