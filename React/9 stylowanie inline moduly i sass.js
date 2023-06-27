import './FooterMap.css';

export function FooterMap(props) {
	const elements = ['link4', 'link5', 'link6'];

	return (
		<div>
			{/* inline stylowanie */}
			<h1 style={{ color: 'royalblue', backgroundColor: 'orange' }}>FooserMap</h1>
			<ul>
				{/* stylowanie przez klasę z css */}
				{elements.map(el => {
					return <li className='list-item'>{el}</li>;
				})}
			</ul>
		</div>
	);
}

/* żeby stylowaćw sass instalujemy node-sass 
następnie piszemy naszego sassa i importujemy w naszym projekcje

$fontColor: orange;
ul.orange-list li {
	color: $fontColor;
	text-decoration: underline;
}

*/

import './FooterLoop.css';
import './sassstyle.scss';

export default function FooterLoop(props) {
	const elements = ['link1', 'link2', 'link3'];
	const items = [];

	for (const [index, value] of elements.entries()) {
		items.push(<li>{value}</li>);
	}
	return (
		<div>
			<ul className='orange-list'>{items}</ul>
		</div>
	);
}
