import './details.css';
import { useProduct } from '../contexts/ProductsContext';
import sadFace from '../assets/sad-face.png';

function Details({ setPage }) {
  const {products,productSelected} = useProduct()
  const product = products.find(item => item.id === productSelected);

  if (!product){
    return(
      <>
      <img src={sadFace} alt="" />
      <h1> Producto no encontrado</h1>
      <p>El producto que buscar ha sido eliminado o se acabo</p>
      </>
    )
  }
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
