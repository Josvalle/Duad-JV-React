import { useState, useEffect } from 'react';
import { useProduct } from '../contexts/ProductsContext';
import sadFace from '../assets/sad-face.png';
import './products.css';

function ProductList({ setPage }) {
  const {products, setProducts, setProductSelected} = useProduct()
  
  const [pageLoading, setPageLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return (
      <div id="loding-message">
        <h2>Cargando Productos...</h2>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <img id="no-product-image" src={sadFace} alt="" />
        <h2>No hay productos disponibles por el momento.</h2>
      </div>
    );
  }

  return (
    <div className="body-container">
      <h2 className="page-title">Catálogo de productos</h2>
      <div className="cards-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              className="image-product"
              src={product.imagen}
              alt="foto producto"
            />
            <div className="text-aligmner">
              <h3 className="title-product">{product.nombre}</h3>
              <p className="product-price">₡{product.precio}</p>
              <p className="category">{product.categoria}</p>
              <button
                onClick={() => {
                  setProductSelected(product.id);
                  setPage('details');
                }}
                className="card-button"
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
