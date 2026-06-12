import './styles/login.css'
import { Formik,Form,Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import useApi from '../hooks/useApi'
import { useUsers } from '../contexts/UsersContext';


const objectValidation = Yup.object({
    email: Yup.string().required('Correo electronico no puede esta vacio'),
    password: Yup.string().required('Contraseña no puede estar vacia')
})

function Login({setPage}){
    const {users,setUsers,setUserLogin,userAdmin,setUserAdmin} = useUsers()
    const {loading, error,fetchData} = useApi(setUsers)
    const [loginError, setLoginError] = useState('');
    


    return(
        <div id='body-container'>
            <h1 id='login-title'>Iniciar sesión</h1>
            <Formik
                initialValues={{email:'',password:''}}
                validationSchema={objectValidation}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async(values,{resetForm})=>{
                    const response = await fetchData('post','http://localhost:5000/login',values)
                    
                    if (response.status === 200 && response.data.role === 'admin'){
                        setUsers(response.data);
                        setUserLogin(true);
                        setUserAdmin(true)
                        setPage('manager');
                        resetForm();
                        
                    }else if(response.status === 200){
                        setUsers(response.data);
                        setUserLogin(true);
                        setPage('products');
                        resetForm();
                    }else if(response.status === 409){
                        setLoginError('Las credenciales proporcionadas no son válidas. Por favor verifica tu correo y contraseña.')
                        resetForm();
                    }else{
                        setLoginError('Error del Servidor')
                    }
                    
                }
                }>
                    <Form id='login-form'>
                        {loginError && <p id="ErrorMessage">{loginError}</p>}
                        <label htmlFor="email">Correo electrónico: </label>
                        <Field  id='email' className='login-field' name='email'></Field>
                        <ErrorMessage name='email' component="p"/>
                        <label htmlFor="password">Contraseña: </label>
                        <Field type="password" id='password' className='login-field' name='password'></Field>
                        <ErrorMessage name='password' component="p"/>
                        
                        
                        <button className='login-buttons' id='submit-login' type='submit'> 👤 Ingresar</button>
                        <button className='login-buttons' id='cancel-login' type='button' onClick={()=> setPage('home')}>❌ Cancelar</button>
                        
                    </Form>

                </Formik>
        </div>
    )
    
}

export default Login