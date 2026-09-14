import { Star } from 'lucide-react';
import styles from './StarRating.module.css';

export default function StarRating({ rating = 5, size = 14, showValue = false }) {
  const filled = Math.floor(rating);
  const partial = rating % 1;
  const empty = 5 - Math.ceil(rating);

  return (
    <span className={styles.wrapper}>
      {Array.from({ length: filled }).map((_, i) => (
        <Star key={`f${i}`} size={size} className={styles.filled} />
      ))}
      {partial > 0 && (
        <span className={styles.partialWrapper} style={{ '--fill': `${partial * 100}%` }}>
          <Star size={size} className={styles.partial} />
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={size} className={styles.empty} />
      ))}
      {showValue && <span className={styles.value}>{rating}</span>}
    </span>
  );
}
