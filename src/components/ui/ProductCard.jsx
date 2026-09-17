import { useState } from 'react';
import { Heart, Check, ShoppingCart } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { money, installment, discountPercent } from '../../lib/format';
import { navigate } from '../../lib/router';

/**
 * Cartão de produto no formato de marketplace: foto quadrada, preço grande,
 * parcelamento logo abaixo e uma ação só — adicionar ao carrinho.
 *
 * A altura é igual em todos os cartões (grid interno com linhas fixas), para
 * que os botões de uma fileira fiquem alinhados mesmo com nomes de tamanhos
 * diferentes.
 */
export default function ProductCard({ product, compacto = false }) {
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
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <a
      href={href}
      className={`${styles.card} ${compacto ? styles.compacto : ''}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      <div className={styles.media}>
        {image ? (
          <img src={image} alt={name} className={styles.image} loading="lazy" />
        ) : (
          <span className={styles.noImage}>sem foto</span>
        )}

        {off ? <span className={styles.off}>-{off}%</span> : null}
        {!inStock && <span className={styles.soldOut}>esgotado</span>}

        <button
          className={`${styles.heart} ${favorited ? styles.heartOn : ''}`}
          onClick={handleHeart}
          aria-label={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          aria-pressed={favorited}
        >
          <Heart size={15} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className={styles.body}>
        <span className={styles.brand}>{brand || ' '}</span>
        <h3 className={styles.name}>{name}</h3>

        <div className={styles.prices}>
          {originalPrice ? <span className={styles.was}>{money(originalPrice)}</span> : null}
          <span className={styles.price}>{money(price)}</span>
          <span className={styles.parcela}>{installment(price)}</span>
        </div>

        <button
          className={`${styles.add} ${added ? styles.addDone : ''}`}
          onClick={handleAdd}
          disabled={!inStock}
        >
          {!inStock ? (
            'indisponível'
          ) : added ? (
            <>
              <Check size={15} /> no carrinho
            </>
          ) : (
            <>
              <ShoppingCart size={15} /> adicionar
            </>
          )}
        </button>
      </div>
    </a>
  );
}
