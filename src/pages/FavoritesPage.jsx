import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { useFavorites } from '../context/FavoritesContext';
import { useCatalog } from '../data/CatalogContext';
import styles from './FavoritesPage.module.css';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Mais recentes' },
  { value: 'price_asc',  label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'rating',     label: 'Mais bem avaliados' },
];

function sortProducts(list, sort) {
  const copy = [...list];
  if (sort === 'price_asc')  return copy.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') return copy.sort((a, b) => b.price - a.price);
  if (sort === 'rating')     return copy.sort((a, b) => b.rating - a.rating);
  return copy;
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>
        <Heart size={36} />
      </div>
      <h2 className={styles.emptyTitle}>Nenhum favorito ainda</h2>
      <p className={styles.emptyText}>
        Explore nossa loja e salve os produtos que você ama tocando no coração.
      </p>
      <a href="/loja" className={styles.emptyBtn}>
        Explorar loja <ArrowRight size={15} />
      </a>
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites, favoritesCount } = useFavorites();
  const { products } = useCatalog();
  const [sort, setSort] = useState('default');

  const favoriteProducts = sortProducts(
    products.filter((p) => favorites.has(p.id)),
    sort,
  );

  return (
    <>
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
              {favoritesCount > 0 && (
                <p className={styles.pageSubtitle}>
                  {favoritesCount} {favoritesCount === 1 ? 'produto salvo' : 'produtos salvos'}
                </p>
              )}
            </div>
            {favoritesCount > 0 && (
              <div className={styles.pageHeaderDeco} aria-hidden="true">
                <Sparkles size={48} />
              </div>
            )}
          </div>
        </div>

        <div className="container">
          {favoritesCount === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className={styles.toolbar}>
                <p className={styles.toolbarCount}>
                  Mostrando <strong>{favoriteProducts.length}</strong> {favoriteProducts.length === 1 ? 'produto' : 'produtos'}
                </p>
                <div className={styles.sortWrap}>
                  <label className={styles.sortLabel} htmlFor="fav-sort">Ordenar por</label>
                  <select
                    id="fav-sort"
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
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
                <a href="/loja" className={styles.continueBtn}>
                  Ver loja completa <ArrowRight size={14} />
                </a>
              </div>
            </>
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}
