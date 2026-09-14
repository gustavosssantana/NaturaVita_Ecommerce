import { useState } from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { footerLinks as staticFooterLinks } from '../../data/mockData';
import { useCatalog } from '../../data/CatalogContext';
import styles from './Footer.module.css';

function LeafSvg({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 160" fill="none" aria-hidden="true">
      <path d="M50 155 C50 155 8 108 8 62 C8 28 28 5 50 5 C72 5 92 28 92 62 C92 108 50 155 50 155Z"
        stroke="currentColor" strokeWidth="1" />
      <line x1="50" y1="155" x2="50" y2="5" stroke="currentColor" strokeWidth="0.5" />
      <path d="M50 100 Q25 80 20 55" stroke="currentColor" strokeWidth="0.5" />
      <path d="M50 80 Q75 60 80 38" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

export default function Footer() {
  const { categories } = useCatalog();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const footerLinks = {
    ...staticFooterLinks,
    loja: categories.length > 0
      ? categories.slice(0, 4).map((c) => ({ label: c.name, href: `/${c.slug}` }))
      : staticFooterLinks.loja,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer className={styles.footer}>

      {/* ════════════════════════════
          Statement — the big moment
      ════════════════════════════ */}
      <div className={styles.statement}>
        <div className={styles.statementOrb} />
        <LeafSvg className={styles.stLeaf1} />
        <LeafSvg className={styles.stLeaf2} />
        <LeafSvg className={styles.stLeaf3} />

        <div className={`container ${styles.statementInner}`}>
          <div className={styles.statementText}>
            <p className={styles.stLine1}>Nutrição real.</p>
            <p className={styles.stLine2}>
              <em>para quem treina<br />de verdade.</em>
            </p>
          </div>

          <div className={styles.statementBadge}>
            <span className={styles.badgeStar}>✦</span>
            100% Natural
          </div>
        </div>
      </div>

      {/* ════════════════════════════
          Main grid
      ════════════════════════════ */}
      <div className={`container ${styles.mainGrid}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <a href="/" className={styles.logo}>
            <span className={styles.logoLeaf}><Leaf size={15} strokeWidth={2.4} /></span>
            <span className={styles.logoWord}>
              natura<em className={styles.logoItalic}>vita</em>
            </span>
          </a>
          <p className={styles.tagline}>
            Suplementos selecionados,<br />granel e vitaminas com<br />procedência garantida.
          </p>
          <div className={styles.socials}>
            {['IG', 'TT', 'YT', 'FB'].map((s) => (
              <a key={s} href="#" className={styles.social} aria-label={s}>{s}</a>
            ))}
          </div>
        </div>

        {/* Loja */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Loja</h4>
          <ul className={styles.colList}>
            {footerLinks.loja.map((l) => (
              <li key={l.label}><a href={l.href} className={styles.colLink}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        {/* Marca */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Marca</h4>
          <ul className={styles.colList}>
            {footerLinks.marca.map((l) => (
              <li key={l.label}><a href={l.href} className={styles.colLink}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        {/* Ajuda */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Ajuda</h4>
          <ul className={styles.colList}>
            {footerLinks.ajuda.map((l) => (
              <li key={l.label}><a href={l.href} className={styles.colLink}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h4 className={styles.colTitle}>Newsletter</h4>
          <p className={styles.nlDesc}>Ofertas e lançamentos direto no seu e-mail.</p>
          <form className={`${styles.nlForm} ${sent ? styles.nlSent : ''}`} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="seu@email.com"
              className={styles.nlInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.nlBtn} aria-label="Inscrever">
              {sent ? '✓' : <ArrowRight size={14} />}
            </button>
          </form>
          <p className={styles.nlNote}>sem spam · cancele quando quiser</p>
        </div>

      </div>

      {/* ════════════════════════════
          Bottom bar
      ════════════════════════════ */}
      <div className={`container ${styles.bottomBar}`}>
        <span className={styles.copy}>© NaturaVita 2026 · CNPJ 00.000.000/0001-00</span>

        <div className={styles.payments}>
          {['PIX', 'VISA', 'MASTER', 'BOLETO'].map((p) => (
            <span key={p} className={styles.payBadge}>{p}</span>
          ))}
        </div>

        <span className={styles.shipping}>
          <span className={styles.shippingDot} />
          entrega em todo o Brasil
        </span>
      </div>

    </footer>
  );
}
