import './styles/details.css';
import { useProduct } from '../contexts/ProductsContext';
import { useParams, Link } from 'react-router';
import { useUsers } from '../contexts/UsersContext';
import sadFace from '../assets/sad-face.png';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';


function Details() {
  const {id} = useParams();
  const idNumber = Number(id);
  const {users,userLogin} = useUsers()
  const [productDetails,setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {cart, setCart} = useCart()
  
    useEffect(()=>{
      async function loadDetails() {
        
        try{
          const res = await axios.get(`http://localhost:5000/products/details/${idNumber}`)
          setProductDetails(res.data)
          
        }catch(err){
          setError('El producto que busca no se encontro o ya no se encuentra')

        }finally{
          setLoading(false)
        }
        }
      loadDetails();
      

    },[idNumber])
  
    
  
  if(loading === true){
    return(
    <div id='loading-container'>
      <div className='spinner'></div>
      <h2 id='h2-title-loading'>
        Cargando detalles ....
      </h2>
    </div>)
  }else if(error){
    return(<div id='not-found-body'>
      <img src={sadFace} alt="" />
      <h1> Producto no encontrado</h1>
      <p>{error}</p>
    </div>
      
      ) 
    
  }else{
    return (
    
    <div className="div-global">
      <img className="image-details" src={productDetails.imagen} alt="imagen" />
      <div className="details-texts">
        <h1 id="title-product">{productDetails.nombre}</h1>
        <p id="price">₡{productDetails.precio}</p>
        <p id="category">{productDetails.categoria}</p>
        <p id="description">{productDetails.descripcion}</p>
        
        {userLogin === true && productDetails.stock !==0 ? (
          <>

          <p id='current-stock'>Stock: {productDetails.stock}</p>
          <button className='add-cart' onClick={async ()=>{
            
            const itemExist = cart.some( item => item.id === productDetails.id)
            

            if(itemExist === true){
              await axios.put(`http://localhost:5000/cart/details/add/${idNumber}`)
              await axios.put(`http://localhost:5000/products/details/reduce/${idNumber}`)
              const res = await axios.get(`http://localhost:5000/products/details/${idNumber}`);
              const cartItems = await axios.get(`http://localhost:5000/cart/${users.id}`)
              setCart(cartItems.data) 
              setProductDetails(res.data);
              
            }else{
              const backend_item = {
                'user_id': users.id,
                'product_id':productDetails.id,
                "cantidad": 1
              }
            
            await axios.post('http://localhost:5000/cart/new', backend_item)
            await axios.put(`http://localhost:5000/products/details/reduce/${idNumber}`)
            const res = await axios.get(`http://localhost:5000/products/details/${idNumber}`);
            const cartItems = await axios.get(`http://localhost:5000/cart/${users.id}`)
            setCart(cartItems.data)  
            setProductDetails(res.data);  
            }
            

          }}>Agregar al carrito</button>
          </>
          
        ): productDetails.stock ===0 ?(<p id="message-descrip">
          No hay mas articulos disponibles, agregaremos pronto  
        </p>): (<p id="message-descrip">
          Para agregar al carrito por favor inicia session 
        </p>)} 
        <Link id="return-button" to='/products'>Volver al catálogo</Link>
      </div>
    </div>
  );
  }
  
}

export default Details;
