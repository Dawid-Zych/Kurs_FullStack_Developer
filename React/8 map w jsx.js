import './FooterMap.css';

export default function FooterMap(props) {
	const elements = ['link4', 'link5', 'link6'];

	return (
		<div>
			<ul>
				{elements.map(el => {
					return <li>{el}</li>;
				})}
			</ul>
		</div>
	);
}
