import { Component } from 'react';
import './Heading.css';
import ListItem from './styled/ListItem';
import { BorderListItem } from './styled/ListItem';

export default class Heading extends Component {
	constructor() {
		super();
		this.state = {
			link1: 'start',
		};
	}
	render() {
		console.log(this.props);
		return (
			<div>
				<nav>
					<ul className='navigation'>
						<li>Home</li>
						<li>{this.state.link1}</li>
						<li>{this.props.headerTitle}</li>
						<li>Blog</li>
						<li>About</li>
						<ListItem active>FAQ</ListItem>
						<ListItem>TOS</ListItem>
						<BorderListItem>About</BorderListItem>
					</ul>
				</nav>
			</div>
		);
	}
}
