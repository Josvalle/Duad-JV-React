import './Header.css';
import pawlogo from '../assets/paw-logo.png';

function Header({ setPage }) {
  return (
    <nav className="header">
      <div className="logo-title">
        <img className="image-logo" src={pawlogo} alt="logo" />
        <h1>PawStore</h1>
      </div>

      <div className="options">
        <button onClick={() => setPage('home')}>Inicio</button>
        <button onClick={() => setPage('products')}>Productos</button>
        <button onClick={() => setPage('contact')}>Contacto</button>
      </div>
    </nav>
  );
}

export default Header;
