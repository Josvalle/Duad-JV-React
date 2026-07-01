import './styles/manager.css'
import { useProduct } from '../contexts/ProductsContext';
import { useUsers } from '../contexts/UsersContext';
import { Formik,Form,Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import useToken from '../hooks/useToken'
import candado from '../assets/candado.png'
import * as Yup from 'yup';


const objectValidation = Yup.object({
    nombre: Yup.string().required('Por favor completa todos los campos antes de agregar el producto. '),
    descripcion: Yup.string().required('Por favor completa todos los campos antes de agregar el producto. '),
    precio: Yup.number().required('Por favor completa todos los campos antes de agregar el producto. '),
    categoria: Yup.string().required('Por favor completa todos los campos antes de agregar el producto. '),
    imagen: Yup.string().required('Por favor completa todos los campos antes de agregar el producto. '),
    stock: Yup.number().required('Por favor completa todos los campos antes de agregar el producto. ')
})



function Manager(){
    const {products, setProducts,setProductSelected, loadProducts} = useProduct()
    const {fetchDataToken} = useToken(setProducts)
    const {users,userAdmin,userLogin} = useUsers()
    const navigate = useNavigate()

    useEffect(()=>{
        async function loadInfo() {
            await loadProducts()
        }
        loadInfo()
    },[loadProducts])

    if(userLogin === false){
        return(
            <div className='no-admin-container' >
                <img id='block-image' src={candado} alt="" />
                <h1 id='no-admin-title'>Debes Iniciar session para Continuar</h1>
                <p id='no-login-message'> Necesitas iniciar sesion para confirmar que tienes los permisos para ingresar a esta seccion</p>
                <button className='permssion-buttons' id='go-login' onClick={()=>navigate('/login')} >Iniciar sesion</button>
            </div>
        )
    }else if(userAdmin === false){
        return(
            <div className='no-admin-container' >
                <img id='block-image' src={candado} alt="" />
                <h1 id='no-admin-title'>No tienes permiso para acceder a esta sección.</h1>
                <button className='permssion-buttons' id='home-return' onClick={()=>navigate('/')}>Iniciar sesion</button>
            </div>
        )
    }else{
        return(
        <>
        <div id='administration-container'>
            <h1>Administración de productos</h1>
            <p>En esta sección puedes gestionar el catálogo de productos de PawStore.</p>
            <div id='table-container' >
                <table>
                    <thead id='head-table'>
                        <tr id='th-containers'>
                            <th className='th-manager' id='th-id'>ID</th>
                            <th className='th-manager' id='th-name'>Nombre</th>
                            <th className='th-manager' id='th-price'>Precio</th>
                            <th className='th-manager' id='th-category'>Categoria</th>
                            <th className='th-manager' id='th-stock'>Stock</th>
                            <th className='th-manager'id='th-actions'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id='manager-tbody'>
                        {
                            products.map((product)=>(
                                <tr key={product.id} className='product-row'>
                                    <td>{product.id}</td>
                                    <td>{product.nombre}</td>
                                    <td>₡{product.precio}</td>
                                    <td>{product.categoria}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <div className='buttons-actions'>
                                            <button id={product.id} className='edit-button' onClick={()=>{navigate(`/manager/${product.id}`)}}>✎ Editar</button>
                                            
                                            <button onClick={ async()=>{
                                                await fetchDataToken('delete','http://localhost:5000/products',{"id":product.id},users.token);
                                                await loadProducts();
                                            }} className='delete-button'> 🗑 Borrar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
        <div id='form-container'>
            <h1 id='form-title'>Agregar nuevo producto</h1>
            <Formik
                initialValues={{nombre: '', descripcion: '', precio: 0, categoria:'',imagen:'', stock:0}}
                validationSchema={objectValidation}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (values, {resetForm})=> {
                    await fetchDataToken('post','http://localhost:5000/products',values,users.token);
                    await loadProducts();
                    resetForm();
                }

                }>
                    <Form id='new-product-form'>
                        <label htmlFor="nombre">Nombre: </label>
                        <Field id='nombre' className='inputs-forms' name='nombre' placeholder='Nombre del producto'/>
                        <ErrorMessage name='nombre' component="p" />

                        <label htmlFor="descripcion">Descripcion: </label>
                        <Field as="textarea" id='descripcion' className='inputs-forms' name='descripcion' placeholder='Ingresa la descripcion del producto'/>
                        <ErrorMessage name='descripcion' component="p" />

                        <label htmlFor="precio">Precio: </label>
                        <Field id='precio' className='inputs-forms' name='precio' placeholder='Ingresa el precio'/>
                        <ErrorMessage name='precio' component="p" />

                        <label htmlFor="categoria">Categoria: </label>
                        <Field id='categoria' className='inputs-forms' name='categoria'placeholder='Ingresa la categoria'/>
                        <ErrorMessage name='categoria' component="p" />

                        <label htmlFor="imagen">URL Imagen: </label>
                        <Field id='imagen' className='inputs-forms' name='imagen' placeholder='URL de la image ejemplo: /image/gatos.co'/>
                        <ErrorMessage name='imagen' component="p" />

                        <label htmlFor="stock">Stock: </label>
                        <Field id='stock' className='inputs-forms' name='stock'/>
                        <ErrorMessage name='stock' component="p" placeholder='Cantidad de stock disponible'/>
                        <button id='submit-form' type='submit'>Agregar Producto</button>
                    </Form>
                </Formik>
                
        
        </div>
        </>
        
    )
    }

    
}

export default Manager;