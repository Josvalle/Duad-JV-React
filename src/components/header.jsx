import './styles/Header.css';
import pawlogo from '../assets/paw-logo.png';
import { useUsers } from '../contexts/UsersContext';
import { NavLink, Link, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';

function Header() {
  const {users,userLogin,userAdmin,setUsers,setUserAdmin,setUserLogin} = useUsers()
  const {cart,setCart} = useCart()
  const navigate = useNavigate()
  return (
    <nav className="header">
      <div className="logo-title">
        <img className="image-logo" src={pawlogo} alt="logo" />
        <h1>PawStore</h1>
      </div>

      <div className="options">
        <NavLink className={"header-Nav"} to="/">Inicio</NavLink>
        <NavLink className={"header-Nav"} to="/products">Productos</NavLink>
        <NavLink className={"header-Nav"} to="/contact">Contacto</NavLink>
        {userLogin === false ? 
        (<NavLink id='login-button' className={"header-Nav"} to="/login">Iniciar sesión</NavLink>
		) : users.role === 'admin' ? (<>
          <NavLink className={"header-Nav"} to="/manager">Administracion</NavLink>
          <p>Session Iniciada como: {users.username}</p>
          <NavLink className='cart-button' to="/cart">🛒 Carrito {cart.length}</NavLink>
          <NavLink id='close-session' className={"header-Nav"} to="/"
            onClick={()=> {
              setUserLogin(false);
              setUsers([])
              setUserAdmin(false)
            }}
          >Cerrar sesión</NavLink>
          
          </>) : ( <>
          <p>Session Iniciada como: {users.username}</p>
          <NavLink className='cart-button' to="/cart">🛒 Carrito {cart.length}</NavLink>
          <NavLink id='close-session' className={"header-Nav"} to="/"
            onClick={()=> {
              setUserLogin(false);
              setUsers([])
              setUserAdmin(false);
              setCart([])
              
            }}
          >Cerrar sesión</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
