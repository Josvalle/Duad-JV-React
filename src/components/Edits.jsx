import './styles/edits.css'
import { useProduct } from '../contexts/ProductsContext'
import { Formik,Form,Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Edits({setPage}){
    const {products,productSelected,setProducts} = useProduct()
    const product = products.find(item => item.id === productSelected);

    return(
        <div id='form-container'>
            <h1>Editar producto</h1>
            <Formik
            initialValues={{nombre:product.nombre, descripcion:product.descripcion, precio: product.precio, categoria:product.categoria,imagen:product.imagen, stock:product.stock}}
            onSubmit={(values)=>{
                setProducts((editProducts) => editProducts.map(
                    (item) => item.id === productSelected ? {...item, ...values} : item));

                    setPage('manager')
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

export default Edits;