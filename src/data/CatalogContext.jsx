import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [state, setState] = useState({
    store: null,
    categories: [],
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch('/api/catalog')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Erro ao carregar produtos.');
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setState({
          store: data.store || null,
          categories: data.categories || [],
          products: data.products || [],
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState((s) => ({ ...s, loading: false, error: String(err.message || err) }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => {
    const { categories, products } = state;

    const byId = new Map(products.map((p) => [p.id, p]));

    // Products that actually carry their own photo look best in showcases.
    const withImage = products.filter((p) => p.image);

    const onSale = products.filter((p) => p.originalPrice);
    const weeklyOffers = (onSale.length >= 6 ? onSale : withImage).slice(0, 12);

    const bestSellers = withImage.slice(0, 24);
    const highlightedProduct = onSale.find((p) => p.image) || withImage[0] || products[0] || null;

    const filterTabs = [
      { id: 'all', label: 'Todos' },
      ...categories.slice(0, 6).map((c) => ({ id: c.slug, label: c.name })),
    ];

    function getProduct(id) {
      return byId.get(id) || null;
    }

    function productsIn(slug) {
      if (!slug || slug === 'loja') return products;
      return products.filter((p) => p.category === slug);
    }

    function search(term) {
      const q = (term || '').trim().toLowerCase();
      if (!q) return [];
      const words = q.split(/\s+/);
      return products
        .filter((p) => {
          const hay = `${p.name} ${p.brand || ''} ${p.sku || ''}`.toLowerCase();
          return words.every((w) => hay.includes(w));
        })
        .slice(0, 60);
    }

    return {
      ...state,
      filterTabs,
      weeklyOffers,
      bestSellers,
      highlightedProduct,
      getProduct,
      productsIn,
      search,
    };
  }, [state]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog precisa estar dentro de <CatalogProvider>');
  return ctx;
}
