import { Component } from 'react';
import TaskItem from '../TaskItem/TaskItem';

export default class Tasks extends Component {
	// generujemy nasze komponenty tastitem z tablicy która jest przekazana do props
	getTaskItem = () => {
		return this.props.taskItem.map(item => <TaskItem key={item.id} {...item} />);
	};

	render() {
		return (
			<div className='container'>
				<div className='my-3 p-3 bg-body rounded shadow-sm'>{this.getTaskItem()}</div>
			</div>
		);
	}
}
