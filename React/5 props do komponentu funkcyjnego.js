import './Footer.css';
/* dodajemy propsy do konstruktora i następnie odwołujemy się w nawiasach kwadratowych */
function Footer(props) {
	return (
		<div>
			<footer>
				<ul>
					<li>Regulamin</li>
					<li>FAQ</li>
					<li>Contact: {props.contact}</li>
					<li>ToS</li>
				</ul>
			</footer>
		</div>
	);
}
export default Footer;
