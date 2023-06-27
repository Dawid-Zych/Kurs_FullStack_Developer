/* instalujemy naszą paczkę npm i styled-components  lub npm i styled-components@latest*/

/* Tworzymy nasz plik i stylujemy bezpośrenio z backtikami */
import styled from 'styled-components';

const ListItem = styled.li`
	cursor: pointer;
	text-decoration: silver;
	background-color: yellow;

	&:hover {
		text-decoration: none;
		background-color: black;
		color: white;
	}
`;

export default ListItem;

/* nastepnie importujemy i dodajemy do naszego projektu stylowany element li */
import { Component } from 'react';
import './Heading.css';
import ListItem from './styled/ListItem';

export /* default */ class Heading extends Component {
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

						{/* dodajemy props wpływające na styled-components */}
						<ListItem active>FAQ</ListItem>
						<ListItem>TOS</ListItem>
					</ul>
				</nav>
			</div>
		);
	}
}

/* 
    zmieniamy linie
	background-color: ${props => (props.active ? 'red' : 'silver')};

*/
