import styles from './CommunitySection.module.css';

const ugcCount = 5;

export default function CommunitySection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="section-title">momentos da comunidade.</h2>
          <a href="https://instagram.com/naturavita.br" className={styles.instaBtn} target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Instagram
          </a>
          <p className={styles.handle}>marca @naturavita.br pra aparecer</p>
        </div>

        <div className={styles.grid}>
          {Array.from({ length: ugcCount }).map((_, i) => (
            <div key={i} className={`${styles.ugcItem} img-placeholder`}>
              <span>UGC {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
