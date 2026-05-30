import './manager.css'
import { useProduct } from '../contexts/ProductsContext';
import { Formik,Form,Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const objectValidation = Yup.object({
    nombre: Yup.string().required('Por favor completa todos los campos antes de agregar el producto. '),
    descripcion: Yup.string().required('Por favor completa todos los campos antes de agregar el producto. '),
    precio: Yup.number().required('Por favor completa todos los campos antes de agregar el producto. '),
    categoria: Yup.string().required('Por favor completa todos los campos antes de agregar el producto. '),
    imagen: Yup.string().required('Por favor completa todos los campos antes de agregar el producto. '),
    stock: Yup.number().required('Por favor completa todos los campos antes de agregar el producto. ')
})



function Manager({setPage}){
    const {products, setProducts,setProductSelected} = useProduct()
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
                                            <button id={product.id} onClick={()=> {setPage('edits'); setProductSelected(product.id)}} className='edit-button'>✎ Editar</button>
                                            <button onClick={()=>{
                                                
                                                setProducts((deleteProduct)=> deleteProduct.filter((item)=>item.id !== product.id))
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
                onSubmit={(values, {resetForm})=> {
                    const highId = Math.max(...products.map((item)=>item.id))

                    const newproduct = {
                        id: highId +1,
                        ...values,
                    };
                    setProducts((newproducts) => [...newproducts, newproduct]);
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

export default Manager;