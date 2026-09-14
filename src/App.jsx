import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';

const RESERVED_SLUGS = ['carrinho', 'perfil', 'favoritos', 'configuracoes', 'produto', ''];

function parsePath(pathname) {
  const parts = pathname.replace(/^\//, '').split('/');
  return { first: parts[0] || '', second: parts[1] || '' };
}

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const { first, second } = parsePath(pathname);

  if (first === 'carrinho') return <CartPage />;
  if (first === 'perfil') return <ProfilePage />;
  if (first === 'favoritos')     return <FavoritesPage />;
  if (first === 'configuracoes') return <SettingsPage />;

  if (first === 'produto' && second) {
    return <ProductPage productId={parseInt(second)} />;
  }

  if (first && !RESERVED_SLUGS.includes(first)) {
    return <CategoryPage slug={first} />;
  }

  return <HomePage />;
}
