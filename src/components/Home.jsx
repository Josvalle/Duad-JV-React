import './styles/home.css';

function Home({ setPage }) {
  return (
    <div className="body-home">
      <h1>Bienvenido a PawStore</h1>
      <p className="home-text">
        Somos una tienda dedicada a ofrecer productos de calidad para tus
        mascotas.
      </p>
      <p className="home-text">
        Explora nuestro catálogo para encontrar camas, juguetes, accesorios y
        más.
      </p>
      <button id="b-products" onClick={() => setPage('products')}>
        Ver productos
      </button>
      <p id="info-text" className="home-text">
        Esta es la página principal de la aplicación. Más adelante aquí se
        podrán mostrar productos destacados.
      </p>
    </div>
  );
}

export default Home;
