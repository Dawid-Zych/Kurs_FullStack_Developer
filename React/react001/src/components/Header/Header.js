import { Component } from 'react';
import './Header.css';

export default class Header extends Component {
	constructor(props) {
		super(props);

		// początkowy stan zmiennych aplikacji, jedyny przypadek
		// keidy bezpośednio możemy zapisać wartości początkowe state
		this.state = {
			link: 'home',
			linkClicked: false,
		};
	}

	/*
        Cykl życia komponentów można podzielić na 3 fazy:
        - mounting - montowanie czyli wstawianie komponentu do drzewa DOM
        - update - aktualizacja komponentu jeśli zmieni się stan albo props
        - unmount - demontowanie komponentu, czyli usuwanie z drzewa DOM

        Każda z faz ma różne funkcje, które w większości są opcjonalne do wykorzystania.

        -----------------------------------------------------------------------

        Montowanie można podzielić na 4 fazy:
        - constructor() - wywołany gdy komponent jest zainicjalizowany, tutaj 
            ustawiane są początkowe wartości state, również przyjmuje obiekt 
            props z przekazanymi argumentami.  W przypadku props zawsze trzeba 
            wywołać konstruktor rodzica super(props);. Konstruktor Opcjonalny.

        - getDerivedStateFromProps(props, state) - wywołana przed renderowaniem 
          komponentu, rzadko używana, można zmienić tutaj state na podstawie 
          props i zwrócić co wpłynie na renderowanie.

        - render() - obowiązkowa metoda, renderuje komponent, dodaje go do 
                     drzewa DOM

        - componentDidMount() - komponent jest już w drzewie DOM, można tutaj 
                                modyfikować DOM

    */

	// montowanie, wywołana przed renderowaniem, modyfikujemy state
	static getDerivedStateFromProps(props, state) {
		return {
			link: props.homePageName, // zmiana "home" na "start" dzięki props
		};
	}

	// montowanie - komponent w drzewie DOM, można do zmodyfikować
	componentDidMount() {
		document.querySelector('nav ul').style.border = '2px solid red';
	}

	/*
        Cykl życia komponentu:
        Update - aktualizacja komponentu jeśli zmieni się state lub props,
        proces ten można podzielić na 5 faz: 
        - getDerivedStateFromProps(props, state) - wywołana jako pierwsza w fazie 
          update przed renderowaniem komponentu, rzadko  używana, można zmienić 
          tutaj state na podstawie props i zwrócić go co wpłynie na renderowanie.
        - shouldComponentUpdate() - funkcja określa czy komponent ma być 
          renderowany, domyślnie zwraca true.
        - render() - obowiązkowa metoda, renderuje komponent, dodaje go do DOM
        - getSnapshotBeforeUpdate(prevProps, prevState) - pozwala na dostęp do 
          poprzedniej wersji props i state, która była przed update, ale po 
          wykonanym update. Jeśli jest w komponencie to również musi być 
          obecna funkcja componentDidUpdate(), inaczej będzie błąd.
        - componentDidUpdate() - funkcja wywoływana gdy komponent został 
          zaktualizowany w drzewie DOM.
    */

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
		// react nie będzie wiedział że coś zminiło się w komponencie
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

	/*
        Cykl życia komponentu:
        unmount - demontowanie komponentu, czyli usuwanie z drzewa DOM
        Dostępna w tej fazie jest jedna funkcja:
        componentWillUnmount() - wywołana w momencie odmontowania 
                                 komponentu, przydatne aby zakończyć np 
                                 jakąś funkcję działającą w tle jak timer itd.
    */
}
