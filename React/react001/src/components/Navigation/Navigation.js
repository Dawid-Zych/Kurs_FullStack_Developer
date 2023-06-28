import './Navigation.css';
import { Link } from 'react-router-dom';
import { Component } from 'react';

export default class Navigation extends Component {
	render() {
		return (
			<nav>
				<ul>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/articles'>Articles</Link>
					</li>
				</ul>
			</nav>
		);
	}
}
