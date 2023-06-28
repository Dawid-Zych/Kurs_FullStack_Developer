import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import Footer from './components/Footer/Footer';
import Heading from './components/Heading/Heading';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Articles from './components/Articles/Articles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const address = {
	street: 'Wilcza 7',
	city: 'Warszawa',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Header homePageName='startujemy' />
		<Heading headerTitle='Hello from Header!' />
		{/* <App /> */}
		<BrowserRouter>
			<Navigation />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/articles' element={<Articles />} />
			</Routes>
		</BrowserRouter>
		<Footer contact='admin@example.com' address={address} />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
