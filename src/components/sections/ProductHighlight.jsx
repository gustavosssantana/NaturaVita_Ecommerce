import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import StarRating from '../ui/StarRating';
import Link from '../ui/Link';
import { useCatalog } from '../../data/CatalogContext';
import { useCart } from '../../context/CartContext';
import { money, installment, discountPercent } from '../../lib/format';
import styles from './ProductHighlight.module.css';

function LeafDecor({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M50 155 C50 155 8 108 8 62 C8 28 28 5 50 5 C72 5 92 28 92 62 C92 108 50 155 50 155Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line x1="50" y1="155" x2="50" y2="5" stroke="currentColor" strokeWidth="0.5" />
      <path d="M50 100 Q25 80 20 55" stroke="currentColor" strokeWidth="0.5" />
      <path d="M50 80 Q75 60 80 38" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

export default function ProductHighlight() {
  const { highlightedProduct: product } = useCatalog();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const off = discountPercent(product.price, product.originalPrice);

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

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
            <span>
              e <em>essencial.</em>
            </span>
          </h2>
          <p className={styles.desc}>
            Seleção conferida item a item, com procedência garantida e envio para todo o Brasil.
          </p>
        </div>

        <div className={styles.productCard}>
          {off && (
            <div className={styles.badgeRow}>
              <span className={styles.discountBadge}>-{off}% OFF</span>
            </div>
          )}

          <div className={styles.cardInner}>
            <Link href={`/produto/${product.id}`} className={styles.productImage}>
              {product.image ? (
                <img src={product.image} alt={product.name} className={styles.img} loading="lazy" />
              ) : (
                <span className={styles.noImg}>sem foto</span>
              )}
            </Link>

            <div className={styles.productInfo}>
              <div className={styles.ratingRow}>
                <StarRating rating={product.rating} size={13} />
                <span className={styles.ratingText}>({product.reviews} avaliações)</span>
              </div>

              <Link href={`/produto/${product.id}`} className={styles.productName}>
                {product.name}
              </Link>

              <div className={styles.priceRow}>
                <span className={styles.price}>{money(product.price)}</span>
                {product.originalPrice && (
                  <span className={styles.originalPrice}>{money(product.originalPrice)}</span>
                )}
              </div>
              <p className={styles.installment}>ou {installment(product.price)} sem juros</p>

              <button
                className={`${styles.addBtn} ${added ? styles.addBtnDone : ''}`}
                onClick={handleAdd}
                disabled={!product.inStock}
              >
                {added ? (
                  <>
                    <Check size={16} /> adicionado
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> add ao carrinho
                  </>
                )}
              </button>

              <Link href={`/produto/${product.id}`} className={styles.detailsLink}>
                ver detalhes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
