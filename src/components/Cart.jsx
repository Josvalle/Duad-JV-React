import './styles/cart.css'
import { useCart } from '../contexts/CartContext'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUsers } from '../contexts/UsersContext';
import sadFace from '../assets/sad-face.png';
import candado from '../assets/candado.png'
import axios from 'axios';

function Cart(){
    const {cart,setCart} = useCart();
    const [stock,setStock] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const {users, userLogin} = useUsers()

    const total = cart.reduce((counter,item)=>{
        const subtotal = item.cantidad * item.precio;
        return counter + subtotal
    },0)

    useEffect(()=>{
        async function loadStock() {

        try{
            const res = await axios.get(`http://localhost:5000//products/details/stock`)
            if (users?.id !== undefined){
                const cartItems = await axios.get(`http://localhost:5000/cart/${users.id}`)
                setCart(cartItems.data)
            }
            
            setStock(res.data)
        }catch(err){
            setError('El producto que busca no se encontro o ya no se encuentra')

        }finally{
            setLoading(false)
        }
            
        }
        loadStock()
    },[])

    if(userLogin === false){
            return(
                <div className='no-admin-container' >
                    <img id='block-image' src={candado} alt="" />
                    <h1 id='no-admin-title'>Debes Iniciar session para Continuar</h1>
                    <p id='no-login-message'> Necesitas iniciar sesion para confirmar que tienes los permisos para ingresar a esta seccion</p>
                    <button className='permssion-buttons' id='go-login' onClick={()=>navigate('/login')} >Iniciar sesion</button>
                </div>
            )
        }else if (cart.length===0){
        return(
            <div id='empty-cart-div'>
                <img id="no-product-image" src={sadFace} alt="" />
                <h2>No hay productos agregados por el momento.</h2>
            </div>
        )
    }else if (loading === true){
        <div id='loading-container'>
            <div className='spinner'></div>
            <h2 id='h2-title-loading'>
                Cargando carrito ....
            </h2>
        </div>
    }else{
        return(
            <div id='cart-body-container'>
                <h1> Carrito de compras</h1>
                <div className='card-subtotal'>
                        <div id='cart-card-container'>
                            {cart.map((item)=>{
                                    const productStock = stock.find((product)=>product.id === item.id)
                
                                return(
                                
                                <div key={item.id} className='item-card'>
                                    <img className='cart-image' src={item.imagen} alt="imagen producto" />
                                    <h4 className='cart-title'>{item.nombre}</h4>
                                    <div className='quantity-container'>
                                        <button className='cart-car-button' id='less-button' onClick={async()=>{
                                                                    
                                                                if(item.cantidad === 1){
                                                                    await axios.delete(`http://localhost:5000/cart/delete/${item.id}`, {data: {"user_id":users.id}} )
                                                                    const cartItems = await axios.get(`http://localhost:5000/cart/${users.id}`)
                                                                    setCart(cartItems.data)
                                                                }
                                                                await axios.put(`http://localhost:5000/cart/details/reduce/${item.id}`)
                                                                await axios.put(`http://localhost:5000/products/details/adding/${item.id}`)
                                                                const resC = await axios.get(`http://localhost:5000//products/details/stock`)
                                                                const cartItems = await axios.get(`http://localhost:5000/cart/${users.id}`)
                                                                setCart(cartItems.data)
                                                                setStock(resC.data)
                                                                }}>-</button>
                                        <p className='quantity-p'>{item.cantidad}</p>
                                        {productStock.stock !== 0 ? (<button className='cart-car-button' id='add-button' 
                                        disabled={productStock.stock ===0}
                                        onClick={async ()=>{
                                                await axios.put(`http://localhost:5000/cart/details/add/${item.id}`)
                                                await axios.put(`http://localhost:5000/products/details/reduce/${item.id}`)
                                                const resC = await axios.get(`http://localhost:5000//products/details/stock`)
                                                const cartItems = await axios.get(`http://localhost:5000/cart/${users.id}`)
                                                setCart(cartItems.data)
                                                setStock(resC.data)
                                                
                                                                                        }} >+</button>):
                                                                                        (<p> No hay mas stock para agregar </p>) }
                                        
                                    </div>
                                    
                                    <div className='amount-containers'>
                                        <p className='unit-price'>Precio: ₡{item.precio}</p>
                                        <p className='subtotal-price'>Subtotal: ₡{item.precio * item.cantidad}</p>
                                    </div>
                                    <button className='delete-card-button'
                                    onClick={async()=>{
                                                const body = {
                                                    "stock":item.cantidad
                                                }
                                                await axios.delete(`http://localhost:5000/cart/delete/${item.id}`, {data: {"user_id":users.id}} )
                                                await axios.put(`http://localhost:5000/products/details/adding/${item.id}`, body)
                                                const cartItems = await axios.get(`http://localhost:5000/cart/${users.id}`)
                                                setCart(cartItems.data)
                                                
                                    }}>🗑 Eliminar</button>
                                </div>
                                )
                            })}
                        </div>
                        <div id='subtotal-containter'>
                            <div className='subtotal-title'>
                                <h3>Total: </h3>
                                <p>₡{total}</p>
                            </div>
                            
                            <button className='checkout-button' onClick={()=>navigate('/checkout')}> Continuar al Checkout</button>
                        </div>
                </div>
                
            </div>
            
        )
    }
}

export default Cart