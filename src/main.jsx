import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CatalogProvider } from './data/CatalogContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogProvider>
      <FavoritesProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FavoritesProvider>
    </CatalogProvider>
  </StrictMode>
);
