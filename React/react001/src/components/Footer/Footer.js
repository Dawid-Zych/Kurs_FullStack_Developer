import './Footer.css';
import Copyright from '../Copyright/Copyright';
import FooterLoop from '../FooterLoop/FooterLoop';
import FooterMap from '../FooterMap/FooterMap';

function Footer(props) {
	return (
		<div>
			<footer>
				<ul>
					<li>Regulamin</li>
					<li>FAQ</li>
					<li>Contact: {props.contact}</li>
					<li>
						Address:
						{props.address.street} {props.address.city}
					</li>
					<li>ToS</li>
					<li>
						<Copyright year='2023' />
					</li>
				</ul>

				<FooterLoop />
				<FooterMap />
			</footer>
		</div>
	);
}
export default Footer;
