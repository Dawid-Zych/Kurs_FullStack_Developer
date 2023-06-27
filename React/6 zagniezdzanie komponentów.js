    import './Copyright.css';
    import { Component } from 'react';

    /* exportujemy nasz komponent */
    export default class Copyright extends Component {
        render() {
            return (
                <div>
                    <span>
                        Copyright: &copy;:
                        {this.props.year} example.com
                    </span>
                </div>
            );
        }
    }


    /*importujemy go dzies indziej np w Footer.js */ 
    import './Footer.css';
    import Copyright from '../Copyright/Copyright';

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
                </footer>
            </div>
        );
    }
    export default Footer;