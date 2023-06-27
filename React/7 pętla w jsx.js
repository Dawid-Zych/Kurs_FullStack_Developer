import './FooterLoop.css';

export default function FooterLoop(props) {
	const elements = ['link1', 'link2', 'link3'];
	const items = [];

	for (const [index, value] of elements.entries()) {
		items.push(<li>{value}</li>);
	}
	return (
		<div>
			<ul>{items}</ul>
		</div>
	);
}
/*  Następnie wklejamy nasz komponent gdzieś indziej
	<FooterLoop /> */
