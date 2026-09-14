import { ArrowRight } from 'lucide-react';
import styles from './HeroSection.module.css';

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

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.orb} />
      <LeafDecor className={styles.leaf1} />
      <LeafDecor className={styles.leaf2} />
      <LeafDecor className={styles.leaf3} />

      <div className={`container ${styles.inner}`}>

        {/* ── Left ── */}
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgePulse} />
            Novidades da semana
          </div>

          <h1 className={styles.headline}>
            Nutrição de<br />
            verdade,{' '}
            <em className={styles.headlineItalic}>sem<br />concessões.</em>
          </h1>

          <p className={styles.subtitle}>
            Mais de 1.200 produtos selecionados — suplementos,
            granel e vitaminas entregues em todo o Brasil.
          </p>

          <div className={styles.ctaRow}>
            <a href="/loja" className={styles.ctaBtn}>
              Ver produtos em oferta <ArrowRight size={15} />
            </a>
            <a href="/loja" className={styles.ctaGhost}>
              Explorar loja
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>2014</span>
              <span className={styles.statLabel}>fundação</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>1.200+</span>
              <span className={styles.statLabel}>produtos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>15k+</span>
              <span className={styles.statLabel}>clientes</span>
            </div>
          </div>
        </div>

        {/* ── Right ── */}
        <div className={styles.imageStage}>
          <div className={styles.imageFrame}>
            <div className={`${styles.imageFill} img-placeholder`}>
              <span>foto produto</span>
            </div>
            <div className={styles.imageOverlay} />
            <div className={styles.floatingBadge}>
              <span className={styles.floatingBadgeDot}>✦</span>
              100% Natural
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
