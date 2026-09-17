import { ChevronRight } from 'lucide-react';
import Link from '../ui/Link';
import { useCatalog } from '../../data/CatalogContext';
import styles from './CategoryGrid.module.css';

/**
 * Atalhos de categoria logo abaixo do banner — é por onde a maioria entra.
 * A foto é a de um produto real da categoria, então nada aqui é ilustração
 * genérica.
 */
export default function CategoryGrid() {
  const { categories } = useCatalog();
  if (!categories.length) return null;

  const lista = categories.slice(0, 12);

  return (
    <section className={`section ${styles.sec}`}>
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">
            Comprar por <em>categoria</em>
          </h2>
          <Link href="/loja" className="section-link">
            ver tudo <ChevronRight size={15} />
          </Link>
        </div>

        <div className={styles.grade}>
          {lista.map((c) => (
            <Link key={c.id} href={`/${c.slug}`} className={styles.item}>
              <span className={styles.foto}>
                {c.image ? (
                  <img src={c.image} alt="" loading="lazy" />
                ) : (
                  <span className={styles.semFoto} />
                )}
              </span>
              <span className={styles.nome}>{c.name}</span>
              <span className={styles.qtd}>{c.count} itens</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
