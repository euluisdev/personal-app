import {
    BsLinkedin,
    BsGithub,
    BsInstagram,
} from 'react-icons/bs';

import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
        <div className="footer-icons">
            <ul>
                <li><a href="https://www.linkedin.com/in/luis-figueiredo-077aba1a3/"><BsLinkedin /></a></li> 
                <li><a href="https://github.com/euluisdev"><BsGithub /></a></li> 
                <li> <a href="https://github.com/euluisdev"><BsInstagram /></a></li> 
            </ul>
        </div>
        <div className="developed">
            <p>Desenvolvido por: <a href="https://github.com/euluisdev">euluis-dev</a></p> 
            <p>Todos os direitos reservados: &copy;2024 BestFit</p> 
        </div>
    </footer>
  )
};

export default Footer;
