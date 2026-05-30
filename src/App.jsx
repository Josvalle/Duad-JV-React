import { useState } from 'react';
import './App.css';
import Header from './components/header';
import EndFot from './components/Footer';
import Home from './components/Home';
import Products from './components/Products';
import Details from './components/Details';
import Manager from './components/Manager'
import Edits from './components/Edits';
import { ProvideProduct } from './contexts/ProductsContext';

function App() {
  const [page, setPage] = useState('home');
  

  return (
    <div className="app">
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

      </main>

      </ProvideProduct>
      

      <EndFot />
    </div>
  );
}

export default App;
