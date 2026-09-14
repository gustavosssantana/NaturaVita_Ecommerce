import { useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useCatalog } from '../../data/CatalogContext';
import ProductCard from '../ui/ProductCard';
import styles from './BestSellers.module.css';

export default function BestSellers() {
  const { products, filterTabs } = useCatalog();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>nossos mais vendidos.</h2>
            <p className={styles.subtitle}>quem treina, escolhe NaturaVita.</p>
          </div>
          <a href="/loja" className={styles.viewAll}>ver todos →</a>
        </div>

        <div className={styles.controls}>
          <div className={styles.filterTabs}>
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.filterTab} ${activeFilter === tab.id ? styles.active : ''}`}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button className={styles.sortBtn}>
            <SlidersHorizontal size={14} />
            ordenar
            <ChevronDown size={14} />
          </button>
        </div>

        <div className={styles.grid}>
          {filtered.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
