/* 
    React router jest to specjalna biblioteka która umożliwia
    tworzenie podstron w aplikacji reactowej. Dzięki czemu
    po kliknięciu w link od razu dynamicznie pojawi się podstrona.
    Nasza aplikacja będzie działała jak prawdziwa aplikacja a nie 
    jak zwykła strona, gdzie trzeba czekać aż przeglądarka przeładuje
    strone która bedzie załadowana z serwera.

    Do tego potrzebujemy osobnej biblioteki react-router-dom

    Musimy dodać kilka komponentów by nasz router odpowiednio działał
    -komponent odpowiadający za nawigacje
*/

import './Navigation.css';
import { Link } from 'react-router-dom';
import { Component } from 'react';

export default class Navigation extends Component {
	render() {
		return (
			<nav>
				<ul>
					<li>
						<Link to='/'>Home</Link>
						<Link to='/articles'>Articles</Link>
					</li>
				</ul>
			</nav>
		);
	}
}

/* Tworzymy także komponent Home i Articles */
/* Nastepnie w naszym głownym pliku index.js importujemy
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Articles from './components/Articles/Articles';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'; */

root.render(
	<React.StrictMode>
		<Header homePageName='startujemy' />
		<Heading headerTitle='Hello from Header!' />
		{/* <App /> */}
		{/* tworzymy nasz router */}
		<BrowserRouter>
			<Navigation />
			{/* nasze sćieżki */}
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/articles' element={<Articles />} />
			</Routes>
		</BrowserRouter>
		<Footer contact='admin@example.com' address={address} />
	</React.StrictMode>
);
