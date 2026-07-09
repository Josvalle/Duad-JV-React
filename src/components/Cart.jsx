import './styles/cart.css'
import { useCart } from '../contexts/CartContext'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUsers } from '../contexts/UsersContext';
import sadFace from '../assets/sad-face.png';
import NotLogin from './UserNotLogin';
import axios from 'axios';

function Cart(){
    const {cart,total,setCart,addToCart,deleteToCart,reduceToCart,loadCart,bError,setBError,load,setLoad} = useCart();
    const [stock,setStock] = useState([]);
    const navigate = useNavigate();
    const {users, userLogin} = useUsers();
    const API_URL = import.meta.env.VITE_URL;
    
    

    useEffect(()=>{
        async function loadStock() {

        try{
            const res = await axios.get(`${API_URL}/products/details/stock`)
            await loadCart(API_URL,users.id)
            setStock(res.data)
            setLoad(false)
        }catch(error){
            setBError(true)
        }
        }
        loadStock()
    },[users.id])

    if(userLogin === false){
            return <NotLogin />
        }else if (load === true){
        return(
            <div id='loading-container'>
                <div className='spinner'></div>
                <h2 id='h2-title-loading'>
                    Cargando carrito ....
                </h2>
            </div>
        )
        
    }else if(bError){
        return(
            <div id='backend-error-div'>
                <img id="no-product-image" src={sadFace} alt="" />
                <h2>Hubo un error con el proceso por favor intente de nuevo</h2>
            </div>
        )
    }else if (cart.length===0){
        return(
            <div id='empty-cart-div'>
                <img id="no-product-image" src={sadFace} alt="" />
                <h2>Tu carrito está vacío.</h2>
            </div>
        )
    }else{
        return(
            <div id='cart-body-container'>
                <h1> Carrito de compras</h1>
                <div className='card-subtotal'>
                        <div id='cart-card-container'>
                            {cart.map((item)=>{

                                    const productStock = stock.find((product)=>product.id === item.id)
                                    if (!productStock) {
                                                    return (
                                                    <div key={item.id} className="item-card">
                                                        <p>{item.nombre}</p>
                                                        <p>Cargando stock...</p>
                                                    </div>
                                                    );
                                                }
                                return(
                                
                                <div key={item.id} className='item-card'>
                                    <img className='cart-image' src={item.imagen} alt="imagen producto" />
                                    <h4 className='cart-title'>{item.nombre}</h4>
                                    <div className='quantity-container'>
                                        <button className='cart-car-button' id='less-button' onClick={async()=>{
                                                                    
                                                                if(item.cantidad === 1){
                                                                    await deleteToCart(API_URL,item.id,users.id,item.cantidad)
                                                                }else{
                                                                    await reduceToCart(API_URL,item.id,users.id)
                                                                    const resC = await axios.get(`${API_URL}/products/details/stock`);
                                                                    setStock(resC.data);
                                                                }
                                                                
                                                                }}>-</button>
                                        <p className='quantity-p'>{item.cantidad}</p>
                                        {productStock.stock !== 0 ? (<button className='cart-car-button' id='add-button' 
                                        disabled={productStock.stock ===0}
                                        onClick={async ()=>{
                                                await addToCart(API_URL,item.id,users.id)
                                                const resC = await axios.get(`${API_URL}/products/details/stock`)
                                                setStock(resC.data)
                                                    }} >+</button>):(<p> No hay mas stock para agregar </p>) }
                                        
                                    </div>
                                    
                                    <div className='amount-containers'>
                                        <p className='unit-price'>Precio: ₡{item.precio}</p>
                                        <p className='subtotal-price'>Subtotal: ₡{item.precio * item.cantidad}</p>
                                    </div>
                                    <button className='delete-card-button'
                                    onClick={async()=>{
                                                await deleteToCart(API_URL,item.id,users.id,item.cantidad)
                                    }}>🗑 Quitar</button>
                                </div>
                                )
                            })}
                        </div>
                        <div id='subtotal-containter'>
                            <div className='subtotal-title'>
                                <h3>Total: </h3>
                                <p>₡{total}</p>
                            </div>
                            
                            <button className='checkout-button' onClick={()=>navigate('/checkout')}> Ir al checkout</button>
                        </div>
                </div>
                
            </div>
            
        )
    }
}

export default Cart