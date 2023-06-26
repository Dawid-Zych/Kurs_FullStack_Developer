import './FooterLoop.css';
import './sassstyle.scss';

export default function FooterLoop(props) {
	const elements = ['link1', 'link2', 'link3'];
	const items = [];

	// eslint-disable-next-line no-unused-vars
	for (const [index, value] of elements.entries()) {
		items.push(<li>{value}</li>);
	}
	return (
		<div>
			<ul className='orange-list'>{items}</ul>
		</div>
	);
}
