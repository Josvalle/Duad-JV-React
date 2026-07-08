import { useState, useEffect } from 'react';
import { useProduct } from '../contexts/ProductsContext';
import sadFace from '../assets/sad-face.png';
import { Link } from 'react-router';
import './styles/products.css';

function ProductList() {
  const {products,setProductSelected,loading} = useProduct()
  

  if (loading) {
    return (
      <div id="loding-message">
        <h2>Cargando Productos...</h2>
      </div>
    );
  }else if (products.length === 0 ) {
    return (
      <div className="no-products">
        <img id="no-product-image" src={sadFace} alt="" />
        <h2>No hay productos disponibles por el momento.</h2>
      </div>
    );
  }else{
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
              <Link className='card-button' to={`/products/${product.id}`}>
              Ver detalles
              </Link>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  }

  
}

export default ProductList;
