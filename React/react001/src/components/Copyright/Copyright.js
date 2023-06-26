import './Copyright.css';
import { Component } from 'react';

export default class Copyright extends Component {
	render() {
		return (
			<div>
				<span>
					Copyright: &copy;:
					{this.props.year} example.com
				</span>
			</div>
		);
	}
}
