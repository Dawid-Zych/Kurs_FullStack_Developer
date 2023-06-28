import { Component } from 'react';

export default class Header extends Component {
	constructor(props) {
		super(props);
	}
	TEXT_HEADER_SAVE = 'Save';

	render() {
		return (
			<div className='container'>
				<div className='my-3 p-3 bg-body rounded shadow-sm'>
					<div className='input-group input-groum-sm'>
						<span className='input-group-text bg-light'>Task:</span>
						<input type='text' id='task-name' placeholder='Task Information' className='form-control' />
						<button className='btn btn-success btn-sm' type='button' id='btn-save'>
							{this.TEXT_HEADER_SAVE}
						</button>
					</div>
				</div>
			</div>
		);
	}
}
