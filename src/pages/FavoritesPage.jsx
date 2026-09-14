import { useState, useMemo } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import ProductCard from '../components/ui/ProductCard';
import CartToast from '../components/ui/CartToast';
import Link from '../components/ui/Link';
import { useFavorites } from '../context/FavoritesContext';
import { useCatalog } from '../data/CatalogContext';
import styles from './FavoritesPage.module.css';

const SORT_OPTIONS = [
  { value: 'default', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'name', label: 'Nome (A–Z)' },
];

export default function FavoritesPage() {
  const { favorites, favoritesCount } = useFavorites();
  const { products, loading } = useCatalog();
  const [sort, setSort] = useState('default');

  const favoriteProducts = useMemo(() => {
    const list = products.filter((p) => favorites.has(p.id));
    const copy = [...list];
    if (sort === 'price_asc') copy.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') copy.sort((a, b) => b.price - a.price);
    else if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return copy;
  }, [products, favorites, sort]);

  const showEmpty = !loading && favoriteProducts.length === 0;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={`container ${styles.pageHeaderInner}`}>
            <div className={styles.pageHeaderText}>
              <div className={styles.pageLabel}>
                <Heart size={13} />
                Lista de desejos
              </div>
              <h1 className={styles.pageTitle}>
                Meus <em>favoritos.</em>
              </h1>
              {favoriteProducts.length > 0 && (
                <p className={styles.pageSubtitle}>
                  {favoriteProducts.length}{' '}
                  {favoriteProducts.length === 1 ? 'produto salvo' : 'produtos salvos'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="container">
          {loading ? (
            <div className={styles.grid} style={{ paddingTop: 28 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : showEmpty ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Heart size={34} />
              </div>
              <h2 className={styles.emptyTitle}>
                {favoritesCount > 0 ? 'Seus favoritos saíram do catálogo' : 'Nenhum favorito ainda'}
              </h2>
              <p className={styles.emptyText}>
                {favoritesCount > 0
                  ? 'Os produtos que você salvou não estão mais disponíveis na loja.'
                  : 'Toque no coração de qualquer produto para salvar aqui e encontrar depois.'}
              </p>
              <Link href="/loja" className={styles.emptyBtn}>
                Explorar loja <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.toolbar}>
                <p className={styles.toolbarCount}>
                  Mostrando <strong>{favoriteProducts.length}</strong>{' '}
                  {favoriteProducts.length === 1 ? 'produto' : 'produtos'}
                </p>
                <div className={styles.sortWrap}>
                  <label className={styles.sortLabel} htmlFor="fav-sort">
                    Ordenar por
                  </label>
                  <select
                    id="fav-sort"
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.grid}>
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className={styles.continueShopping}>
                <p>Quer descobrir mais produtos?</p>
                <Link href="/loja" className={styles.continueBtn}>
                  Ver loja completa <ArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <CartToast />
    </>
  );
}
