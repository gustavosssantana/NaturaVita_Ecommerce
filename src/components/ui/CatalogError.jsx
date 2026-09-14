import { AlertTriangle } from 'lucide-react';
import { useCatalog } from '../../data/CatalogContext';
import styles from './CatalogError.module.css';

// Shown only when the Nuvemshop API call fails, so a broken catalog never
// looks like an empty store.
export default function CatalogError() {
  const { error } = useCatalog();
  if (!error) return null;

  return (
    <div className={styles.wrap}>
      <div className="container">
        <div className={styles.banner}>
          <AlertTriangle size={17} />
          <div>
            <p className={styles.title}>Não conseguimos carregar os produtos agora.</p>
            <p className={styles.text}>
              Atualize a página em alguns instantes. Se continuar, o catálogo pode estar
              temporariamente indisponível.
            </p>
          </div>
          <button className={styles.retry} onClick={() => window.location.reload()}>
            tentar de novo
          </button>
        </div>
      </div>
    </div>
  );
}
