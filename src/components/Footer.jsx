import './styles/footer.css';

function Footer() {
  return (
    <footer className="foot-container">
      <div className="message-container">
        <p>© PawStore 2026 — Todos los derechos reservados.</p>
      </div>
      <div className="link-container">
        <a id="link-social" href="">
          Instagram
        </a>
        <a href="">Facebook</a>
      </div>
    </footer>
  );
}

export default Footer;
