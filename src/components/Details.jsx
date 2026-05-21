import './details.css';

function Details({ setPage, product }) {
  return (
    <div className="div-global">
      <img className="image-details" src={product.imagen} alt="imagen" />
      <div className="details-texts">
        <h1 id="title-product">{product.nombre}</h1>
        <p id="price">₡{product.precio}</p>
        <p id="category">{product.categoria}</p>
        <p id="description">{product.descripcion}</p>
        <p id="message-descrip">
          Más adelante aquí se podrá agregar este producto al carrito y
          completar la compra
        </p>
        <button onClick={() => setPage('products')} id="return-button">
          Volver al catálogo
        </button>
      </div>
    </div>
  );
}

export default Details;
