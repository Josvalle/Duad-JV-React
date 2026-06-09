import './styles/Header.css';
import pawlogo from '../assets/paw-logo.png';
import { useUsers } from '../contexts/UsersContext';


function Header({ setPage }) {
  const {users,userLogin,userAdmin,setUserAdmin,setUserLogin} = useUsers()
  return (
    <nav className="header">
      <div className="logo-title">
        <img className="image-logo" src={pawlogo} alt="logo" />
        <h1>PawStore</h1>
      </div>

      <div className="options">
        <button onClick={() => setPage('home')}>Inicio</button>
        <button onClick={() => setPage('products')}>Productos</button>
        <button onClick={() => setPage('contact')}>Contacto</button>
        {userLogin === false ? 
        (<button id='login-button' onClick={()=> setPage('login')}>Iniciar sesión</button>)
          :(<>
          <button onClick={()=> setPage('manager')}>Administracion</button>
          <p>Session Iniciada como: {users.username}</p>
          <button id='close-session' onClick={()=> {
            setPage('home'); 
            setUserLogin(false);
            if(userAdmin === true){
              setUserAdmin(false)
            }
            }}>Cerrar sesión</button>
          </>
          )
          }
      </div>
    </nav>
  );
}

export default Header;
