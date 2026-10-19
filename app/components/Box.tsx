export default function Box({ children, section = false, className = '' }) {
	const classes = `box ${className}`;
	if (section) {
		return <section className={classes}>{children}</section>
	}
	return <div className={classes}>{children}</div>;
}
