import './App.css';

import { Component } from 'react';
import Header from './components/Header/Header';
import Tasks from './components/Tasks/Tasks';

export default class App extends Component {
	constructor(props) {
		super(props);

		// tworzymy nasze poczatkowo taski
		this.state = {
			tasks: [
				{ id: 0, name: 'Task #001', user: 'Ania', status: 'ToDo', color: 'primary' },
				{ id: 1, name: 'Task #002', user: 'Kasia', status: 'Done', color: 'success' },
				{ id: 2, name: 'Task #003', user: 'Marcin', status: 'ToDo', color: 'dark' },
				{ id: 3, name: 'Task #004', user: 'Dawid', status: 'InProgress', color: 'warning' },
			],
		};
	}

	createNewTask = task => {
		const newId = this.state.tasks.length;
		this.setState({
			tasks: [
				...this.state.tasks,
				{
					id: newId,
					name: task.newTaskName,
					user: task.user,
					status: 'InProgress',
					color: task.color,
				},
			],
		});
	};

	render() {
		return (
			<div className='App'>
				<div>
					<Header createNewTaskCallback={this.createNewTask} />
					<Tasks taskItem={this.state.tasks} />
				</div>
			</div>
		);
	}
}
