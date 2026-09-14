import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import FavoritesPage from './pages/FavoritesPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import { parseLocation } from './lib/router';
import { useCatalog } from './data/CatalogContext';

export default function App() {
  const [location, setLocation] = useState({
    pathname: window.location.pathname,
    search: window.location.search,
  });
  const { categories, loading } = useCatalog();

  useEffect(() => {
    const handlePop = () =>
      setLocation({ pathname: window.location.pathname, search: window.location.search });
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const { first, second, params } = parseLocation(location.pathname, location.search);

  // `key` remounts the page when the route parameter changes, which resets its
  // internal state (filters, quantity, gallery) without a reset effect.
  if (first === '') return <HomePage />;
  if (first === 'carrinho') return <CartPage />;
  if (first === 'checkout') return <CheckoutPage />;
  if (first === 'favoritos') return <FavoritesPage />;
  if (first === 'busca') {
    const q = params.get('q') || '';
    return <SearchPage key={q} query={q} />;
  }
  if (first === 'loja') return <CategoryPage key="loja" slug="loja" />;

  if (first === 'produto' && second) {
    const id = parseInt(second, 10);
    if (!Number.isNaN(id)) return <ProductPage key={id} productId={id} />;
    return <NotFoundPage />;
  }

  // Any other single segment is treated as a category slug — but only once the
  // catalog has loaded, otherwise a valid category would flash a 404.
  if (first) {
    const known = categories.some((c) => c.slug === first);
    if (known || loading) return <CategoryPage key={first} slug={first} />;
    return <NotFoundPage />;
  }

  return <NotFoundPage />;
}
