import { useCatalog } from '../../data/CatalogContext';
import styles from './CategoryGrid.module.css';

export default function CategoryGrid() {
  const { categories } = useCatalog();
  return (
    <section className={`section-sm ${styles.section}`}>
      <div className="container">
        <h2 className={styles.title}>Comprar por categoria</h2>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <a key={cat.id} href={`/${cat.slug}`} className={styles.card}>
              <div className={`${styles.cardImage} img-placeholder`} />
              <span className={styles.cardLabel}>{cat.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
