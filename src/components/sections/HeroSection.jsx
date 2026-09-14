import { ArrowRight } from 'lucide-react';
import Link from '../ui/Link';
import { useCatalog } from '../../data/CatalogContext';
import styles from './HeroSection.module.css';

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

export default function HeroSection() {
  const { products, categories, highlightedProduct } = useCatalog();

  const productCount = products.length;
  const roundedCount = productCount >= 100 ? `${Math.floor(productCount / 100) * 100}+` : productCount || '—';

  return (
    <section className={styles.hero}>
      <div className={styles.orb} />
      <LeafDecor className={styles.leaf1} />
      <LeafDecor className={styles.leaf2} />
      <LeafDecor className={styles.leaf3} />

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgePulse} />
            Suplementos e naturais
          </div>

          <h1 className={styles.headline}>
            Nutrição de
            <br />
            verdade,{' '}
            <em className={styles.headlineItalic}>
              sem
              <br />
              concessões.
            </em>
          </h1>

          <p className={styles.subtitle}>
            Suplementos, vitaminas, granel e naturais selecionados — com entrega para todo o Brasil.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/loja" className={styles.ctaBtn}>
              Ver todos os produtos <ArrowRight size={15} />
            </Link>
            {categories[0] && (
              <Link href={`/${categories[0].slug}`} className={styles.ctaGhost}>
                Explorar {categories[0].name}
              </Link>
            )}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{roundedCount}</span>
              <span className={styles.statLabel}>produtos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{categories.length || '—'}</span>
              <span className={styles.statLabel}>categorias</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>24h</span>
              <span className={styles.statLabel}>envio</span>
            </div>
          </div>
        </div>

        <div className={styles.imageStage}>
          <Link
            href={highlightedProduct ? `/produto/${highlightedProduct.id}` : '/loja'}
            className={styles.imageFrame}
          >
            {highlightedProduct?.image ? (
              <img
                src={highlightedProduct.image}
                alt={highlightedProduct.name}
                className={styles.heroImg}
              />
            ) : (
              <span className={styles.imageFallback}>NaturaVita</span>
            )}
            <div className={styles.imageOverlay} />
            <div className={styles.floatingBadge}>
              <span className={styles.floatingBadgeDot}>✦</span>
              100% Natural
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
