import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCatalog } from '../../data/CatalogContext';
import ProductCard from '../ui/ProductCard';
import styles from './WeeklyOffers.module.css';

export default function WeeklyOffers() {
  const { weeklyOffers, loading } = useCatalog();
  const trackRef = useRef(null);

  function scrollBy(direction) {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  if (!loading && weeklyOffers.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              ofertas da <em className={styles.italic}>semana.</em>
            </h2>
            <p className={styles.subtitle}>selecionados com desconto enquanto durar o estoque</p>
          </div>
          <div className={styles.navButtons}>
            <button className={styles.navBtn} onClick={() => scrollBy(-1)} aria-label="Anterior">
              <ChevronLeft size={19} />
            </button>
            <button className={styles.navBtn} onClick={() => scrollBy(1)} aria-label="Próximo">
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className={styles.track} ref={trackRef}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className={styles.skeleton} />)
            : weeklyOffers.map((product) => (
                <div key={product.id} className={styles.slide}>
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
