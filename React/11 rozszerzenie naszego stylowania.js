import styled from 'styled-components';

const ListItem = styled.li`
	cursor: pointer;
	text-decoration: silver;
	background-color: ${props => (props.active ? 'red' : 'silver')};

	&:hover {
		text-decoration: none;
		background-color: black;
		color: white;
	}
`;

/* rozszerzamy nasz ListItem  tworzymy zmienna wywołujemy styled i rozszerzamy o border*/
export const BorderListItem = styled(ListItem)`
	border: 2px solid orange;
`;

export default ListItem;
