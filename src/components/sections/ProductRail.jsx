import { ChevronRight } from 'lucide-react';
import Link from '../ui/Link';
import ProductCard from '../ui/ProductCard';
import styles from './ProductRail.module.css';

/**
 * Fileira de produtos que desliza para o lado. É o formato que as lojas
 * grandes usam: mostra muita coisa sem transformar a home num rolo infinito.
 */
export default function ProductRail({ titulo, destaque, href = '/loja', produtos = [], carregando = false }) {
  if (!carregando && !produtos.length) return null;

  return (
    <section className={`section ${styles.sec}`}>
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">
            {titulo} {destaque && <em>{destaque}</em>}
          </h2>
          <Link href={href} className="section-link">
            ver tudo <ChevronRight size={15} />
          </Link>
        </div>

        <div className={`rail rail-bleed ${styles.trilho}`}>
          {carregando && !produtos.length
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`skeleton ${styles.fantasma}`} />
              ))
            : produtos.map((p) => (
                <div key={p.id} className={styles.item}>
                  <ProductCard product={p} compacto />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
