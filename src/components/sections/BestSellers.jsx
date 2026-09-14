import { useState, useMemo } from 'react';
import { useCatalog } from '../../data/CatalogContext';
import ProductCard from '../ui/ProductCard';
import Link from '../ui/Link';
import styles from './BestSellers.module.css';

const PAGE = 8;

export default function BestSellers() {
  const { products, categories, loading } = useCatalog();
  const [activeFilter, setActiveFilter] = useState('all');

  const tabs = useMemo(
    () => [{ id: 'all', label: 'Todos' }, ...categories.slice(0, 5).map((c) => ({ id: c.slug, label: c.name }))],
    [categories]
  );

  const filtered = useMemo(() => {
    const base = activeFilter === 'all' ? products : products.filter((p) => p.category === activeFilter);
    // Products with their own photo first — they simply look better in a grid.
    return base.filter((p) => p.image).slice(0, PAGE);
  }, [products, activeFilter]);

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>nossos destaques.</h2>
            <p className={styles.subtitle}>quem treina, escolhe NaturaVita.</p>
          </div>
          <Link href="/loja" className={styles.viewAll}>
            ver todos →
          </Link>
        </div>

        {!loading && tabs.length > 1 && (
          <div className={styles.controls}>
            <div className={styles.filterTabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.filterTab} ${activeFilter === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: PAGE }).map((_, i) => <div key={i} className={styles.skeleton} />)
            : filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <p className={styles.empty}>Nenhum produto nesta categoria por enquanto.</p>
        )}
      </div>
    </section>
  );
}
