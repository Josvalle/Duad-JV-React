import './styles/checkout.css'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router'
import { useUsers } from '../contexts/UsersContext';
import { Formik,Form,Field, ErrorMessage } from 'formik';
import useApi from '../hooks/useApi'
import * as Yup from 'yup';
import 'yup-phone-lite';
import { useState } from 'react';
import confirmation from '../assets/confirmation.png';
import NotLogin from './UserNotLogin';
import sadFace from '../assets/sad-face.png'


const objectValidation = Yup.object({
    nombreCompleto: Yup.string().required('Por favor completa todos los campos antes de completar la compra. '),
    correo: Yup.string().email('Correo electronico invalido').required('Por favor completa todos los campos antes de completar la compra. '),
    direccion: Yup.string().required('Por favor completa todos los campos antes de completar la compra. '),
    telefono: Yup.string().phone('CR','Numero invalido').required('Por favor completa todos los campos antes de completar la compra. '),
    
})

function Checkout(){
    const {cart,setCart,total} = useCart();
    const {users, userLogin} = useUsers();
    const navigate = useNavigate();
    const [purchaseComplete, setPurchaseComplete] = useState(false);
    const {fetchData} =useApi();
    const API_URL = import.meta.env.VITE_URL;
    const [backendError, setBackendError] = useState(false);

    if(userLogin === false){
                return <NotLogin />
        }else if (cart.length===0 && purchaseComplete === false){
            return(
                <div id='empty-cart-div'>
                    <img id="no-product-image" src={sadFace} alt="" />
                    <h2>No hay productos agregados por el momento.</h2>
                </div>
            )
        }else if(backendError === true){
            return(
            <div id='empty-cart-div'>
                    <img id="no-product-image" src={sadFace} alt="" />
                    <h2>Ocurrió un problema al procesar tu compra. Por favor intenta de nuevo.  </h2>
                </div>
            )
            
        }else if (purchaseComplete === true){
            return(
                <div id='body-confirmation'>
                    <img className='confirmation-image'src={confirmation} alt="logo" />
                    <h1 className='title-confirmation'>¡Gracias por tu compra!</h1>
                    <p className='text-confirmation'>Hemos enviado un correo de confirmación con los detalles de tu pedido.</p>
                    <button id='return-product' onClick={()=>navigate('/products')}>Volver al catálogo</button>
                </div>
            )
    }else{
        return(
        <div className='checkout-body'>
            <div className='titles-checkout'>
                <h1 className='checkout-title'>Checkout</h1>
                <h3 className='checkout-subtitle'>Revisa los detalles de tu compra y completa la información necesaria para finalizar el pedido.</h3>
            </div>
            
            <div className='form-details-container'>
                <div className='checkout-form-container'>
                    <h2 className='checkout-titles'>
                        Informacion de compra
                    </h2>
                    <Formik
                    initialValues={{nombreCompleto:'',correo:'',direccion:'',telefono:''}}
                    validationSchema={objectValidation}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={async (values,{resetForm})=>{
                        const cart_without_images = cart.map((item) => {
                                                                        const { imagen,id, ...itemWithoutImage } = item;
                                                                        return itemWithoutImage;
                                                                        });
                        const body = {
                            ...values,
                            'user_id':users.id,
                            'total':total,
                            'products':cart_without_images
                            
                        }
                        const res = await fetchData('post',`${API_URL}/checkout/complete`,body)
                        if(!res){
                            setBackendError(true)
                        }else if (res.status === 200){
                            setPurchaseComplete(true)
                            setCart([])
                            resetForm();
                        }else{
                            setBackendError(true)
                        }
                        
                    }}
                    
                    >
                        <Form id='checkout-form'>
                            <label className='label-checkout' htmlFor="nombreCompleto">Nombre Completo: </label>
                            <Field id='nombreCompleto' className='field-checkout' name="nombreCompleto" placeholder="Nombre completo"></Field>
                            <ErrorMessage name='nombreCompleto' component="p" />

                            <label className='label-checkout' htmlFor="correo">Correo Electronico: </label>
                            <Field id="correo" name="correo" className='field-checkout' placeholder="Ingrese su correo electronico" ></Field>
                            <ErrorMessage name='correo' component="p" />

                            <label className='label-checkout' htmlFor="direccion">Direccion de envio: </label>
                            <Field id='direccion' name='direccion' className='field-checkout' placeholder='Por favor ingrese su dirrecion '></Field>
                            <ErrorMessage name='direccion' component="p" />

                            <label className='label-checkout' htmlFor="telefono">Telefono: </label>
                            <Field id='telefono' name='telefono' className='field-checkout' placeholder='Por favor ingrese su telefono Ej: 506-XXXX-XXXX' ></Field>
                            <ErrorMessage name='telefono' component="p" />
                        </Form>
                    </Formik>
                </div>
                <div className='checkout-details-container'>
                    <h2 className='checkout-titles'>
                        Resumen del pedido
                    </h2>

                    
                    {cart.map((item)=>{
                        return(
                            <div key={item.id}  className='purchase-details '>
                                <div id='product-name-quantity'>
                                    <p id='checkout-name'>
                                        {item.nombre}
                                    </p>
                                    <p id='checkout-quantity'>
                                        {item.cantidad} x ₡{item.precio} 
                                    </p>
                                </div>
                                <p className='checkout-subtotal-item'>
                                    ₡{item.precio * item.cantidad}
                                </p>
                            </div>
                        )
                    })}
                    <div className='subtotal-title'>
                            <h3>Total: </h3>
                            <p>₡{total}</p>
                    </div>
                    <div id='button-chekout-container'>
                        <button 
                        className='checkout-buttons' 
                        id='confirm-button-p' 
                        type='submit' 
                        form='checkout-form'
                        >Confirmar compra</button>
                        <button className='checkout-buttons' id='cancel-button-p' onClick={()=>navigate('/cart')}>Cancelar</button>
                    </div>
                            
                    
                </div>
            </div>
            
        </div>
    )
    }
    
}

export default Checkout