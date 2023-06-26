import { Component } from 'react';
import './Heading.css';

export default class Heading extends Component {
	constructor() {
		super();
		/* this.state jest to obiekt z pewnymi wewnętrznymi wartościami
             charakterystycznymi dla danego componentu */
		this.state = {
			link1: 'start',
		};
	}

	render() {
		return (
			<div>
				<nav>
					<ul className='navigation'>
						<li>Home</li>
						<li>{this.state.link1}</li>
						<Heading headerTitle='Hello from Header!' />
						{/* do komponentów możemy również przekazywać wartości za pomocą props dopisujem w index.js
						następnie możemy użyć  */}
						<li>{this.props.headerTitle}</li>
						<li>Blog</li>
						<li>About</li>
					</ul>
				</nav>
			</div>
		);
	}
}
