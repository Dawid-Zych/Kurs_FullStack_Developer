import { Component } from 'react';
import TaskItem from '../TaskItem/TaskItem';

export default class Tasks extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<div>
					<TaskItem />
				</div>
			</div>
		);
	}
}
