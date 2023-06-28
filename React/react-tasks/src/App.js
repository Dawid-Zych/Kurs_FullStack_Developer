import './App.css';

import { Component } from 'react';
import Header from './components/Header/Header';
import Tasks from './components/Tasks/Tasks';

export default class App extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className='App'>
				<div>
					<Header />
					<Tasks />
				</div>
			</div>
		);
	}
}
