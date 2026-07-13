import candado from '../assets/candado.png'
import { useNavigate } from 'react-router';

function NotAdmin(){
    const navigate = useNavigate()
    return(
            <div className='no-admin-container' >
                <img id='block-image' src={candado} alt="" />
                <h1 id='no-admin-title'>No tienes permiso para acceder a esta sección.</h1>
                <button className='permssion-buttons' id='home-return' onClick={()=>navigate('/')}>Iniciar sesion</button>
            </div>
        )
}

export default NotAdmin;