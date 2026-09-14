import { Leaf, ExternalLink } from 'lucide-react';
import Link from '../ui/Link';
import { useCatalog } from '../../data/CatalogContext';
import styles from './Footer.module.css';

function LeafSvg({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 160" fill="none" aria-hidden="true">
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

export default function Footer() {
  const { categories, store } = useCatalog();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.statement}>
        <div className={styles.statementOrb} />
        <LeafSvg className={styles.stLeaf1} />
        <LeafSvg className={styles.stLeaf2} />

        <div className={`container ${styles.statementInner}`}>
          <div className={styles.statementText}>
            <p className={styles.stLine1}>Nutrição real.</p>
            <p className={styles.stLine2}>
              <em>
                para quem cuida
                <br />
                de verdade.
              </em>
            </p>
          </div>

          <div className={styles.statementBadge}>
            <span className={styles.badgeStar}>✦</span>
            Procedência garantida
          </div>
        </div>
      </div>

      <div className={`container ${styles.mainGrid}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoLeaf}>
              <Leaf size={15} strokeWidth={2.4} />
            </span>
            <span className={styles.logoWord}>
              natura<em className={styles.logoItalic}>vita</em>
            </span>
          </Link>
          <p className={styles.tagline}>
            Suplementos, vitaminas e naturais
            <br />
            com entrega para todo o Brasil.
          </p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Categorias</h4>
          <ul className={styles.colList}>
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link href={`/${c.slug}`} className={styles.colLink}>
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/loja" className={styles.colLink}>
                Ver todas
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Navegue</h4>
          <ul className={styles.colList}>
            <li>
              <Link href="/loja" className={styles.colLink}>
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link href="/busca" className={styles.colLink}>
                Buscar
              </Link>
            </li>
            <li>
              <Link href="/favoritos" className={styles.colLink}>
                Favoritos
              </Link>
            </li>
            <li>
              <Link href="/carrinho" className={styles.colLink}>
                Carrinho
              </Link>
            </li>
          </ul>
        </div>

        {store?.url && (
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Atendimento</h4>
            <ul className={styles.colList}>
              <li>
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.colLink}
                >
                  Loja oficial <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href={`${store.url.replace(/\/$/, '')}/pedido/consultar/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.colLink}
                >
                  Acompanhar pedido <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <span className={styles.copy}>© NaturaVita {year}</span>

        <div className={styles.payments}>
          {['PIX', 'VISA', 'MASTER', 'BOLETO'].map((p) => (
            <span key={p} className={styles.payBadge}>
              {p}
            </span>
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
