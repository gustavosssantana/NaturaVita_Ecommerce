import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCatalog } from '../../data/CatalogContext';
import ProductCard from '../ui/ProductCard';
import styles from './WeeklyOffers.module.css';

const VISIBLE = 3;

export default function WeeklyOffers() {
  const { weeklyOffers } = useCatalog();
  const [offset, setOffset] = useState(0);
  const maxOffset = Math.max(0, weeklyOffers.length - VISIBLE);

  const prev = () => setOffset((v) => Math.max(0, v - 1));
  const next = () => setOffset((v) => Math.min(maxOffset, v + 1));

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">melhores ofertas da semana.</h2>
          </div>
          <div className={styles.navButtons}>
            <button className={styles.navBtn} onClick={prev} disabled={offset === 0}>
              <ChevronLeft size={20} />
            </button>
            <button className={styles.navBtn} onClick={next} disabled={offset >= maxOffset}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className={styles.trackWrapper}>
          <div
            className={styles.track}
            style={{ transform: `translateX(calc(-${offset} * (100% / ${VISIBLE} + 8px)))` }}
          >
            {weeklyOffers.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
