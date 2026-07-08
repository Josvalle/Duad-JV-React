import candado from '../assets/candado.png'
import { useNavigate } from 'react-router';

function NotLogin(){
    const navigate = useNavigate();
    return(
                <div className='no-admin-container' >
                    <img id='block-image' src={candado} alt="" />
                    <h1 id='no-admin-title'>Debes Iniciar session para Continuar</h1>
                    <p id='no-login-message'> Necesitas iniciar sesion para confirmar que tienes los permisos para ingresar a esta seccion</p>
                    <button className='permssion-buttons' id='go-login' onClick={()=>navigate('/login')} >Iniciar sesion</button>
                </div>
            )
}

export default NotLogin;