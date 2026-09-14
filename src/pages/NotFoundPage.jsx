import { ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Link from '../components/ui/Link';
import { useCatalog } from '../data/CatalogContext';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const { categories } = useCatalog();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.inner}>
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>
              Essa página <em className={styles.italic}>não existe.</em>
            </h1>
            <p className={styles.text}>
              O link pode estar errado ou a página saiu do ar. Que tal continuar por aqui?
            </p>

            <Link href="/loja" className={styles.cta}>
              Ver todos os produtos <ArrowRight size={15} />
            </Link>

            {categories.length > 0 && (
              <div className={styles.suggestions}>
                {categories.slice(0, 6).map((c) => (
                  <Link key={c.id} href={`/${c.slug}`} className={styles.suggestion}>
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
