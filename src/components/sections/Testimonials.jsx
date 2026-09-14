import StarRating from '../ui/StarRating';
import { testimonials } from '../../data/mockData';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>quem treina, recomenda.</h2>
          <p className={styles.subtext}>+12 mil reviews verificadas · 4.9/5</p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.id} className={styles.card}>
              <StarRating rating={t.rating} size={14} />
              <p className={styles.text}>"{t.text}"</p>
              <div className={styles.author}>
                <div className={styles.avatar} />
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.verified}>★ verificada</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.trustpilot}>
          <span className={styles.trustIcon}>★</span>
          <span className={styles.trustText}>
            <strong>Trustpilot</strong> · 4.8 / 5
          </span>
        </div>
      </div>
    </section>
  );
}
