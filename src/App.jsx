import { useState } from 'react';
import './App.css';
import Header from './components/header';
import EndFot from './components/Footer';
import Home from './components/Home';
import Products from './components/Products';
import Details from './components/Details';

function App() {
  const [page, setPage] = useState('home');
  const [product, setProduct] = useState(null);

  return (
    <div className="app">
      <Header setPage={setPage} />

      <main className="main-content">
        {page === 'home' && <Home setPage={setPage} />}
        {page === 'products' && (
          <Products setPage={setPage} setproductSelected={setProduct} />
        )}
        {page === 'details' && <Details setPage={setPage} product={product} />}
      </main>

      <EndFot />
    </div>
  );
}

export default App;
