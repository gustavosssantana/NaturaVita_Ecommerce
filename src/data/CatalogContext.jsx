import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [state, setState] = useState({
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

    const filterTabs = [
      { id: 'all', label: 'Todos' },
      ...categories.slice(0, 6).map((c) => ({ id: c.slug, label: c.name })),
    ];

    const weeklyOffers = products.filter((p) => p.originalPrice !== null);
    const fallbackOffers = weeklyOffers.length > 0 ? weeklyOffers : products.slice(0, 6);
    const highlightedProduct = products[0] || null;

    return { ...state, filterTabs, weeklyOffers: fallbackOffers, highlightedProduct };
  }, [state]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog precisa estar dentro de <CatalogProvider>');
  return ctx;
}
