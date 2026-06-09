import './styles/edits.css'
import { useProduct } from '../contexts/ProductsContext'
import { useUsers } from '../contexts/UsersContext';
import { Formik,Form,Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useApi from '../hooks/useApi'
import sadFace from '../assets/sad-face.png';
import candado from '../assets/candado.png'

const objectValidation = Yup.object({
    nombre: Yup.string().required('Por favor completa todos los campos antes de completar la ediccion. '),
    descripcion: Yup.string().required('Por favor completa todos los campos antes de completar la ediccion. '),
    precio: Yup.number().required('Por favor completa todos los campos antes de completar la ediccion. '),
    categoria: Yup.string().required('Por favor completa todos los campos antes de completar la ediccion. '),
    imagen: Yup.string().required('Por favor completa todos los campos antes de completar la ediccion. '),
    stock: Yup.number().required('Por favor completa todos los campos antes de completar la ediccion. ')
})

function Edits({setPage}){
    const {products,productSelected,setProducts,loadProducts} = useProduct()
    const {fetchData} = useApi(setProducts)
    const {userAdmin,userLogin} = useUsers()

    const product = products.find(item => item.id === productSelected);

    if(userAdmin === false){
            return(
                <div className='no-admin-container' >
                    <img id='block-image' src={candado} alt="" />
                    <h1 id='no-admin-title'>No tienes permiso para acceder a esta sección.</h1>
                    <button className='permssion-buttons' id='home-return' onClick={()=>setPage('home')} >Volver al Inicio</button>
                </div>
            )
        }else if(userLogin === false){
            return(
                <div className='no-admin-container' >
                    <img id='block-image' src={candado} alt="" />
                    <h1 id='no-admin-title'>Debes Iniciar session para Continuar</h1>
                    <p id='no-login-message'> Necesitas iniciar sesion para confirmar que tienes los permisos para ingresar a esta seccion</p>
                    <button className='permssion-buttons' id='go-login' onClick={()=>setPage('login')} >Iniciar sesion</button>
                </div>
            )
        }else if(!product){
            return(
            <div className="no-products">
                <img id="no-product-image" src={sadFace} alt="" />
                <h2>No hay productos disponibles por el momento.</h2>
                <p>El producto que buscar ha sido eliminado o se acabo</p>
            </div>)
        }else{
            return(
        <div id='form-container'>
            <h1>Editar producto</h1>
            <Formik
            initialValues={{nombre:product.nombre, descripcion:product.descripcion, precio: product.precio, categoria:product.categoria,imagen:product.imagen, stock:product.stock}}
            validationSchema={objectValidation}
            onSubmit={async (values)=>{
                    const send_values ={
                        "id": product.id,
                        ...values
                    }
                    await fetchData('put','http://localhost:5000/products',send_values);
                    await loadProducts();
                    setPage('manager');
            }}
            >
            <Form id='edit-product-form'>
                        <label htmlFor="nombre">Nombre: </label>
                        <Field id='nombre' className='inputs-forms' name='nombre' />
                        <ErrorMessage name='nombre' component="p" />

                        <label htmlFor="descripcion">Descripcion: </label>
                        <Field as="textarea" id='descripcion' className='inputs-forms' name='descripcion' />
                        <ErrorMessage name='descripcion' component="p" />

                        <label htmlFor="precio">Precio: </label>
                        <Field id='precio' className='inputs-forms' name='precio' />
                        <ErrorMessage name='precio' component="p" />

                        <label htmlFor="categoria">Categoria: </label>
                        <Field id='categoria' className='inputs-forms' name='categoria'/>
                        <ErrorMessage name='categoria' component="p" />

                        <label htmlFor="imagen">URL Imagen: </label>
                        <Field id='imagen' className='inputs-forms' name='imagen' />
                        <ErrorMessage name='imagen' component="p" />

                        <label htmlFor="stock">Stock: </label>
                        <Field id='stock' className='inputs-forms' name='stock'/>
                        <ErrorMessage name='stock' component="p" />
                        <div id='buttons-containers'>
                            <button id='submit-edit' type='submit'> 💾 Guardar cambios</button>
                            <button id='cancel-submit' type='button' onClick={()=> setPage('manager')}>❌ Cancelar</button>
                        </div>
                        
                    </Form>
            </Formik>
        </div>
    )
        }
    


    
}

export default Edits;