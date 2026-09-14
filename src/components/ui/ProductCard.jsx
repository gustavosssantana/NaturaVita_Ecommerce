import { ArrowRight, Heart } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useFavorites } from '../../context/FavoritesContext';

export default function ProductCard({ product, onAdd, variant = 'default' }) {
  const { name, flavor, doses, price, originalPrice, badge, badgeType, image } = product;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  const handleHeart = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  if (variant === 'featured') {
    return (
      <div className={styles.featured}>
        <div className={`${styles.featuredImage} ${image ? '' : 'img-placeholder'}`} style={{ position: 'relative' }}>
          {image ? (
            <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{name} produto</span>
          )}
          <button
            className={`${styles.heartBtn} ${favorited ? styles.heartBtnActive : ''}`}
            onClick={handleHeart}
            aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart size={14} />
          </button>
        </div>
        <div className={styles.featuredMeta}>
          <span className={styles.featuredTag}>
            {doses ? `${doses}G · ` : ''}{flavor?.toUpperCase()}
          </span>
          <h3 className={styles.featuredName}>{name}</h3>
          <div className={styles.featuredFooter}>
            <span className={styles.featuredPrice}>R$ {price.toFixed(2).replace('.', ',')}</span>
            <button className={styles.arrowBtn} onClick={() => onAdd?.(product)}>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.card}
      onClick={() => { window.location.href = `/produto/${product.id}`; }}
    >
      {badge && (
        <span className={`${styles.badge} ${styles[badgeType]}`}>{badge}</span>
      )}
      <button
        className={`${styles.heartBtn} ${favorited ? styles.heartBtnActive : ''}`}
        onClick={handleHeart}
        aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart size={14} />
      </button>
      <div className={`${styles.imageWrapper} ${image ? '' : 'img-placeholder'}`}>
        {image ? (
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span>produto</span>
        )}
      </div>
      <div className={styles.meta}>
        <span className={styles.tag}>{doses ? `${flavor} · ${doses} doses` : flavor}</span>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.footer}>
          <div>
            {originalPrice && (
              <span className={styles.originalPrice}>R$ {originalPrice}</span>
            )}
            <span className={styles.price}>R$ {price}</span>
          </div>
          <button
            className={styles.arrowBtn}
            onClick={(e) => { e.stopPropagation(); onAdd?.(product); }}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
