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
import { ProvideProduct } from './contexts/ProductsContext';
import { ProvideUsers } from './contexts/UsersContext'

function App() {
  const [page, setPage] = useState('home');
  

  return (
    <div className="app">
      <ProvideUsers>
      <Header setPage={setPage} />
      <ProvideProduct>
        <main className="main-content">
        {page === 'home' && <Home setPage={setPage} />}
        {page === 'products' && (
          <Products setPage={setPage}  />
        )}
        {page === 'details' && <Details setPage={setPage}  />}
        {page === 'manager' && <Manager setPage={setPage} />}
        {page === 'edits' && <Edits setPage={setPage} />}
        {page === 'login' && <Login setPage={setPage}/>}

      </main>

      </ProvideProduct>
      </ProvideUsers>
      

      <EndFot />
    </div>
  );
}

export default App;
