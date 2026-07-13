import './styles/errorPage.css'
import sadFace from '../assets/sad-face.png';
import { useNavigate } from 'react-router';
function ErrorPage(){
    const navigate = useNavigate()
    return(
        <div id='not-found-body'>
            <img id="no-product-image" src={sadFace} alt="" />
            <h1 id='h1-not-found'>
                Página no encontrada
            </h1>
            <p id='p-not-found'>
                La página que estás buscando no existe o ha sido movida.
            </p>
            <button id='not-found-b' onClick={()=>navigate('/')}>
                Volver al inicio
            </button>
        </div>
    )
}

export default ErrorPage;