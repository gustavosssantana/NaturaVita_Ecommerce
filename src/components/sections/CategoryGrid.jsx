import { ChevronRight } from 'lucide-react';
import Link from '../ui/Link';
import { useCatalog } from '../../data/CatalogContext';
import styles from './CategoryGrid.module.css';

/**
 * Atalhos de categoria logo abaixo do banner — é por onde a maioria entra.
 *
 * São círculos numa fileira que desliza, e não uma grade: com 12 categorias
 * a grade tomava meia tela do telefone antes de o visitante chegar em
 * qualquer produto. Assim aparecem as três maiores, e o resto vem com o
 * dedo. A ordem é a do catálogo, da categoria com mais produtos para a
 * com menos.
 *
 * A foto é a arte que o lojista subiu no painel; sem arte, é a de um
 * produto real da categoria. Nada aqui é ilustração genérica.
 */
export default function CategoryGrid() {
  const { categories } = useCatalog();
  if (!categories.length) return null;

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

        <div className={`rail ${styles.trilho}`}>
          {categories.map((c) => (
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
