import { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import Link from './Link';
import { useCart } from '../../context/CartContext';
import { money } from '../../lib/format';
import styles from './CartToast.module.css';

export default function CartToast() {
  const { lastAdded, dismissToast, count } = useCart();

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(dismissToast, 4500);
    return () => clearTimeout(t);
  }, [lastAdded, dismissToast]);

  if (!lastAdded) return null;

  const { product, qty } = lastAdded;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <div className={styles.thumb}>
        {product.image ? (
          <img src={product.image} alt="" />
        ) : (
          <Check size={18} />
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.title}>
          <Check size={13} /> Adicionado ao carrinho
        </p>
        <p className={styles.name}>
          {qty > 1 && `${qty}× `}
          {product.name}
        </p>
        <p className={styles.price}>{money(product.price * qty)}</p>
      </div>

      <div className={styles.actions}>
        <Link href="/carrinho" className={styles.cta} onClick={dismissToast}>
          ver carrinho ({count})
        </Link>
        <button className={styles.close} onClick={dismissToast} aria-label="Fechar">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
