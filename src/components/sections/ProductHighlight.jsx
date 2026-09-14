import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import StarRating from '../ui/StarRating';
import { useCatalog } from '../../data/CatalogContext';
import styles from './ProductHighlight.module.css';

function LeafDecor({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M50 155 C50 155 8 108 8 62 C8 28 28 5 50 5 C72 5 92 28 92 62 C92 108 50 155 50 155Z"
        stroke="currentColor" strokeWidth="1" />
      <line x1="50" y1="155" x2="50" y2="5" stroke="currentColor" strokeWidth="0.5" />
      <path d="M50 100 Q25 80 20 55" stroke="currentColor" strokeWidth="0.5" />
      <path d="M50 80 Q75 60 80 38" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

export default function ProductHighlight() {
  const { highlightedProduct } = useCatalog();
  const [selectedVariant, setSelectedVariant] = useState(highlightedProduct?.variants?.[0]);
  const [activeDot, setActiveDot] = useState(0);

  if (!highlightedProduct) return null;

  return (
    <section className={styles.section}>
      <div className={styles.orb} />
      <LeafDecor className={styles.leaf1} />
      <LeafDecor className={styles.leaf2} />

      <div className={`container ${styles.inner}`}>

        <div className={styles.copy}>
          <div className={styles.label}>
            <span className={styles.labelPulse} />
            produto em destaque
          </div>
          <h2 className={styles.headline}>
            <span>Simples, puro</span>
            <span>e <em>essencial.</em></span>
          </h2>
          <p className={styles.desc}>
            Proteína de alta qualidade, sem adição de açúcar. Absorção rápida para recuperação muscular eficiente.
          </p>
        </div>

        <div className={styles.productCard}>
          {highlightedProduct.originalPrice && (
            <div className={styles.badgeRow}>
              <span className={styles.discountBadge}>OFF</span>
            </div>
          )}

          <div className={styles.cardInner}>
            <div className={`${styles.productImage} ${highlightedProduct.image ? '' : 'img-placeholder'}`}>
              {highlightedProduct.image ? (
                <img src={highlightedProduct.image} alt={highlightedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>produto</span>
              )}
            </div>

            <div className={styles.productInfo}>
              <div className={styles.ratingRow}>
                <StarRating rating={highlightedProduct.rating} size={13} />
                <span className={styles.ratingText}>({highlightedProduct.reviews} reviews)</span>
              </div>

              <h3 className={styles.productName}>{highlightedProduct.name}</h3>

              <div className={styles.variants}>
                {highlightedProduct.variants.map((v) => (
                  <button
                    key={v}
                    className={`${styles.variantBtn} ${selectedVariant === v ? styles.variantActive : ''}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>R$ {highlightedProduct.price}</span>
                {highlightedProduct.originalPrice && (
                  <span className={styles.originalPrice}>R$ {highlightedProduct.originalPrice}</span>
                )}
              </div>

              <button className={styles.addBtn}>
                <ShoppingCart size={16} />
                add ao carrinho
              </button>
            </div>
          </div>

          <div className={styles.dots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className={`${styles.dot} ${activeDot === i ? styles.dotActive : ''}`}
                onClick={() => setActiveDot(i)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
