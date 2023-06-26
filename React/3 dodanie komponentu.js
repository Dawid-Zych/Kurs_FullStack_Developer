/*     Tworzymy podkatalog components i footer w src  - będzie to nasz komponent footer

    Możemy stworzyć komponent funkcyjny albo komponent klasowy,
    w drugim przypadku należy rozszerzyc komponent react
 */
import './Footer.css';

function Footer() {
	return (
		<div>
			<footer>
				<ul>
					<li>Regulamin</li>
					<li>FAQ</li>
					<li>ToS</li>
				</ul>
			</footer>
		</div>
	);
}
/* export default Footer; */

import { Component } from 'react';
import './Heading.css';

export default class Heading extends Component {
	render() {
		return (
			<div>
				<nav>
					<ul className='navigation'>
						<li>Home</li>
						<li>Blog</li>
						<li>About</li>
					</ul>
				</nav>
			</div>
		);
	}
}
