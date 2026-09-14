import { useState } from 'react';
import { Heart, Check, Plus } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { money, discountPercent } from '../../lib/format';
import { navigate } from '../../lib/router';

export default function ProductCard({ product }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const { id, name, price, originalPrice, brand, image, inStock } = product;
  const favorited = isFavorite(id);
  const off = discountPercent(price, originalPrice);
  const href = `/produto/${id}`;

  function handleHeart(e) {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(id);
  }

  function handleAdd(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!inStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <a
      href={href}
      className={styles.card}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {off && <span className={`${styles.badge} ${styles.discount}`}>-{off}%</span>}
      {!inStock && <span className={`${styles.badge} ${styles.soldOut}`}>esgotado</span>}

      <button
        className={`${styles.heartBtn} ${favorited ? styles.heartBtnActive : ''}`}
        onClick={handleHeart}
        aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        aria-pressed={favorited}
      >
        <Heart size={14} />
      </button>

      <div className={styles.imageWrapper}>
        {image ? (
          <img src={image} alt={name} className={styles.image} loading="lazy" />
        ) : (
          <span className={styles.noImage}>sem foto</span>
        )}
      </div>

      <div className={styles.meta}>
        {brand && <span className={styles.tag}>{brand}</span>}
        <h3 className={styles.name}>{name}</h3>

        <div className={styles.priceBlock}>
          {originalPrice && <span className={styles.originalPrice}>{money(originalPrice)}</span>}
          <span className={styles.price}>{money(price)}</span>
        </div>

        <button
          className={`${styles.addBtn} ${added ? styles.addBtnDone : ''}`}
          onClick={handleAdd}
          disabled={!inStock}
        >
          {!inStock ? (
            'indisponível'
          ) : added ? (
            <>
              <Check size={14} /> no carrinho
            </>
          ) : (
            <>
              <Plus size={14} /> adicionar
            </>
          )}
        </button>
      </div>
    </a>
  );
}
