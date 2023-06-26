import './FooterMap.css';

export default function FooterMap(props) {
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
