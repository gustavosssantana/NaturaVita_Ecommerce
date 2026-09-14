import { useCatalog } from '../../data/CatalogContext';
import Link from '../ui/Link';
import styles from './CategoryGrid.module.css';

export default function CategoryGrid() {
  const { categories, loading } = useCatalog();

  if (loading) {
    return (
      <section className={`section-sm ${styles.section}`}>
        <div className="container">
          <h2 className={styles.title}>Comprar por categoria</h2>
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className={`section-sm ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Comprar por categoria</h2>
          <Link href="/loja" className={styles.viewAll}>
            ver tudo →
          </Link>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/${cat.slug}`} className={styles.card}>
              <div className={styles.cardImage}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} loading="lazy" className={styles.img} />
                ) : (
                  <span className={styles.noImg}>{cat.name.charAt(0)}</span>
                )}
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardLabel}>{cat.name}</span>
                <span className={styles.cardCount}>{cat.count} produtos</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
