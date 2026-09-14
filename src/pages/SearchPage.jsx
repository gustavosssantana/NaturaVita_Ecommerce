import { useState } from 'react';
import { Search } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import ProductCard from '../components/ui/ProductCard';
import CartToast from '../components/ui/CartToast';
import Link from '../components/ui/Link';
import { useCatalog } from '../data/CatalogContext';
import { navigate } from '../lib/router';
import styles from './SearchPage.module.css';

export default function SearchPage({ query }) {
  const { search, categories, loading } = useCatalog();
  const [term, setTerm] = useState(query || '');

  const results = search(query);

  function submit(e) {
    e.preventDefault();
    const q = term.trim();
    if (q) navigate(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.head}>
            <h1 className={styles.title}>
              {query ? (
                <>
                  resultados para <em className={styles.italic}>“{query}”</em>
                </>
              ) : (
                <>
                  buscar <em className={styles.italic}>produtos.</em>
                </>
              )}
            </h1>

            <form className={styles.searchForm} onSubmit={submit}>
              <Search size={17} />
              <input
                className={styles.searchInput}
                placeholder="Ex: whey, colágeno, vitamina D…"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                autoFocus={!query}
              />
              <button type="submit" className={styles.searchBtn}>
                buscar
              </button>
            </form>

            {query && !loading && (
              <p className={styles.count}>
                {results.length === 0
                  ? 'Nenhum produto encontrado'
                  : `${results.length} ${results.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`}
              </p>
            )}
          </div>

          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : query && results.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Nada por aqui</p>
              <p className={styles.emptyText}>
                Não encontramos nada com esse termo. Tente uma palavra mais simples, como o nome do
                produto ou da marca.
              </p>
              <div className={styles.suggestions}>
                {categories.slice(0, 6).map((c) => (
                  <Link key={c.id} href={`/${c.slug}`} className={styles.suggestion}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : query ? (
            <div className={styles.grid}>
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Digite o que você procura para começar.</p>
              <div className={styles.suggestions}>
                {categories.slice(0, 8).map((c) => (
                  <Link key={c.id} href={`/${c.slug}`} className={styles.suggestion}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartToast />
    </>
  );
}
