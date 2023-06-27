/* state w aplikacji ma niezwykłe duże znaczenie,
    poniewaz odpowiednie zarządzanie stanem pozwala
    na przyspieszenie działania reacta

    wszelkie operacje na zmiennych operacje na tych zmiennych
    wykonujemy za pomocą specjalnej funkcji setstate
    która ustawia wartość danej zmiennej.
    Czyli bezpośrednio ustawiać takie wartości , korzystamy 
    z funkcji do określnia stanu konkretnej zmiennej, żeby react
    wiedział że coś się w komponencie zmieniło
    */

import { Component } from 'react';
import './Header.css';

export default class Header extends Component {
	constructor(props) {
		super(props);

		// początkowy stan zmiennych aplikacji, jedyny przypadek
		// kiedy bezpośednio możemy zapisać wartości początkowe state
		this.state = {
			link: 'home',
			linkClicked: false,
		};
	}

	toggle = event => {
		// Wywołujemy setState by zmienić linkClicked, przekazujemy funkcję
		// strzałkową która otrzyma aktualny state z którego odczytujemy wartość
		// i zwracamy obiekt z properties które mają być zmodyfikowane. React
		// po nazwie property będzie wiedział która zmienna komponentu ma być
		// zmodyfikowana i jesli wartość się zmieniła to odrysuje komponent
		this.setState(state => {
			return {
				linkClicked: !state.linkClicked,
			};
		});

		// można bezpośrednio odczytać wartość state, ale nie można
		// bezpośrednio zapisywać wartości w state (prócz konstruktora) bo
		// react nie będzie wiedział że coś zmieniło się w komponencie
		// i go nie odrysuje
		console.log('clicked: ' + event.target.id + ' linkClicked: ' + this.state.linkClicked);
	};

	render() {
		return (
			<div>
				<nav>
					<ul>
						<li className={this.state.linkClicked ? 'clicked' : ''}>
							<a href='#' id='link' onClick={this.toggle}>
								{this.state.link}
							</a>
							&nbsp; {this.state.linkClicked ? 'clicked' : 'not clicked'}
						</li>
					</ul>
				</nav>
			</div>
		);
	}
}
