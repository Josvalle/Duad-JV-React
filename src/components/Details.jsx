import './styles/details.css';
import { useProduct } from '../contexts/ProductsContext';
import sadFace from '../assets/sad-face.png';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Details({ setPage }) {
  const {productSelected} = useProduct()
  const [productDetails,setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
    useEffect(()=>{
      async function loadDetails() {
        
        try{
          const res = await axios.get(`http://localhost:5000/products/details/${productSelected}`)
          setProductDetails(res.data)
          
        }catch(err){
          setError('El producto que busca no se encontro o ya no se encuentra')

        }finally{
          setLoading(false)
        }
        }
      loadDetails();
      

    },[productSelected])

  if(loading === true){
    return(
    <div id='loading-container'>
      <div className='spinner'></div>
      <h2 id='h2-title-loading'>
        Cargando detalles ....
      </h2>
    </div>)
  }else if(error){
    return(<>
      <img src={sadFace} alt="" />
      <h1> Producto no encontrado</h1>
      <p>{error}</p>
      </>) 
    
  }else{
    return (
    
    <div className="div-global">
      <img className="image-details" src={productDetails.imagen} alt="imagen" />
      <div className="details-texts">
        <h1 id="title-product">{productDetails.nombre}</h1>
        <p id="price">₡{productDetails.precio}</p>
        <p id="category">{productDetails.categoria}</p>
        <p id="description">{productDetails.descripcion}</p>
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
  
}

export default Details;
