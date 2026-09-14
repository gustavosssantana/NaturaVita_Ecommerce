import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { CatalogProvider } from './data/CatalogContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </CatalogProvider>
  </StrictMode>
);
