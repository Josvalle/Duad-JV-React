import { useState } from 'react';
import './App.css';
import Header from './components/header';
import EndFot from './components/Footer';
import Home from './components/Home';
import Products from './components/Products';
import Details from './components/Details';
import Manager from './components/Manager'
import Edits from './components/Edits';
import Login from './components/Login'
import ErrorPage from './components/ErrorPage';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { ProvideProduct } from './contexts/ProductsContext';
import { ProvideUsers } from './contexts/UsersContext'
import { ProvideCart } from './contexts/CartContext';
import { Routes, Route} from 'react-router-dom'

function App() {
  
  

  return (
    <div className="app">
      <ProvideCart>
      <ProvideUsers>
      <Header  />
      <ProvideProduct>
        <main className="main-content">
        

        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/products' element={<Products/>} />
          <Route path='/products/:id' element={<Details/>}/>
          <Route path='/manager' element={<Manager/>}/>
          <Route path='/manager/:id' element={<Edits/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/checkout' element={<Checkout />}/>
          <Route path='*' element={<ErrorPage/>}/>
        </Routes>

      </main>

      </ProvideProduct>
      </ProvideUsers>
      </ProvideCart>

      <EndFot />
    </div>
  );
}

export default App;
