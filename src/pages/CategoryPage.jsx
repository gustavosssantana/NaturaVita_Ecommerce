import { useState, useMemo } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import ProductCard from '../components/ui/ProductCard';
import CartToast from '../components/ui/CartToast';
import CatalogError from '../components/ui/CatalogError';
import Link from '../components/ui/Link';
import { useCatalog } from '../data/CatalogContext';
import styles from './CategoryPage.module.css';

const PAGE_SIZE = 12;

const PRICE_RANGES = [
  { id: 'ate50', label: 'Até R$50', test: (p) => p <= 50 },
  { id: '50a100', label: 'R$50 a R$100', test: (p) => p > 50 && p <= 100 },
  { id: '100a200', label: 'R$100 a R$200', test: (p) => p > 100 && p <= 200 },
  { id: 'acima200', label: 'Acima de R$200', test: (p) => p > 200 },
];

const SORTS = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'menor', label: 'Menor preço' },
  { id: 'maior', label: 'Maior preço' },
  { id: 'nome', label: 'Nome (A–Z)' },
  { id: 'desconto', label: 'Maior desconto' },
];

export default function CategoryPage({ slug }) {
  const { categories, productsIn, loading } = useCatalog();

  const [priceRange, setPriceRange] = useState(null);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sort, setSort] = useState('relevancia');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const isAll = slug === 'loja';
  const category = categories.find((c) => c.slug === slug);
  const base = productsIn(slug);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === priceRange);
    let list = base.filter((p) => {
      if (range && !range.test(p.price)) return false;
      if (onlyDiscount && !p.originalPrice) return false;
      if (onlyInStock && !p.inStock) return false;
      return true;
    });

    list = [...list];
    if (sort === 'menor') list.sort((a, b) => a.price - b.price);
    else if (sort === 'maior') list.sort((a, b) => b.price - a.price);
    else if (sort === 'nome') list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    else if (sort === 'desconto') {
      list.sort((a, b) => {
        const da = a.originalPrice ? 1 - a.price / a.originalPrice : 0;
        const db = b.originalPrice ? 1 - b.price / b.originalPrice : 0;
        return db - da;
      });
    } else {
      // Relevance: products with a photo first, then cheaper ones.
      list.sort((a, b) => {
        if (!!b.image !== !!a.image) return b.image ? 1 : -1;
        return a.price - b.price;
      });
    }
    return list;
  }, [base, priceRange, onlyDiscount, onlyInStock, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const activeCount = (priceRange ? 1 : 0) + (onlyDiscount ? 1 : 0) + (onlyInStock ? 1 : 0);

  const title = isAll ? 'Nossa' : category?.name || slug;
  const italic = isAll ? 'loja.' : '';

  function clearAll() {
    setPriceRange(null);
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <CatalogError />

        <div className={styles.pageHero}>
          <div className="container">
            <nav className={styles.breadcrumb}>
              <Link href="/">Início</Link>
              <span className={styles.breadcrumbSep}>/</span>
              {isAll ? (
                <span className={styles.breadcrumbCurrent}>Loja</span>
              ) : (
                <>
                  <Link href="/loja">Loja</Link>
                  <span className={styles.breadcrumbSep}>/</span>
                  <span className={styles.breadcrumbCurrent}>{title}</span>
                </>
              )}
            </nav>

            <h1 className={styles.heroTitle}>
              {title} {italic && <em className={styles.heroItalic}>{italic}</em>}
            </h1>

            <div className={styles.heroMeta}>
              <p className={styles.heroDesc}>
                {isAll
                  ? 'Todo o catálogo NaturaVita em um só lugar.'
                  : `Seleção de ${title} com procedência garantida.`}
              </p>
              {!loading && (
                <span className={styles.heroCount}>
                  {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className={styles.filtersBar}>
          <div className="container">
            <div className={styles.filterRow}>
              <div className={styles.filterPills}>
                <div className={styles.dropdownWrap}>
                  <button
                    className={`${styles.filterPill} ${priceRange ? styles.pillActive : ''}`}
                    onClick={() => setOpenDropdown(openDropdown === 'preco' ? null : 'preco')}
                  >
                    {priceRange ? PRICE_RANGES.find((r) => r.id === priceRange)?.label : 'Preço'}
                    {priceRange ? (
                      <X
                        size={12}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPriceRange(null);
                          setVisibleCount(PAGE_SIZE);
                        }}
                      />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </button>

                  {openDropdown === 'preco' && (
                    <div className={styles.dropdown}>
                      {PRICE_RANGES.map((r) => (
                        <button
                          key={r.id}
                          className={`${styles.dropdownItem} ${priceRange === r.id ? styles.dropdownItemActive : ''}`}
                          onClick={() => {
                            setPriceRange(priceRange === r.id ? null : r.id);
                            setOpenDropdown(null);
                            setVisibleCount(PAGE_SIZE);
                          }}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className={`${styles.filterPill} ${onlyDiscount ? styles.pillActive : ''}`}
                  onClick={() => {
                    setOnlyDiscount((v) => !v);
                    setVisibleCount(PAGE_SIZE);
                  }}
                >
                  Em promoção
                  {onlyDiscount && <X size={12} />}
                </button>

                <button
                  className={`${styles.filterPill} ${onlyInStock ? styles.pillActive : ''}`}
                  onClick={() => {
                    setOnlyInStock((v) => !v);
                    setVisibleCount(PAGE_SIZE);
                  }}
                >
                  Disponível
                  {onlyInStock && <X size={12} />}
                </button>

                {activeCount > 0 && (
                  <button className={styles.clearBtn} onClick={clearAll}>
                    limpar ({activeCount})
                  </button>
                )}
              </div>

              <div className={styles.dropdownWrap}>
                <button
                  className={styles.sortBtn}
                  onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                >
                  <SlidersHorizontal size={13} />
                  {SORTS.find((s) => s.id === sort)?.label}
                  <ChevronDown size={12} />
                </button>

                {openDropdown === 'sort' && (
                  <div className={`${styles.dropdown} ${styles.dropdownRight}`}>
                    {SORTS.map((s) => (
                      <button
                        key={s.id}
                        className={`${styles.dropdownItem} ${sort === s.id ? styles.dropdownItemActive : ''}`}
                        onClick={() => {
                          setSort(s.id);
                          setOpenDropdown(null);
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Listing ── */}
        <section className={styles.listing}>
          <div className="container">
            {loading ? (
              <div className={styles.grid}>
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className={styles.skeleton} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Nenhum produto encontrado</p>
                <p className={styles.emptyText}>
                  {activeCount > 0
                    ? 'Tente remover alguns filtros para ver mais opções.'
                    : 'Esta categoria ainda não tem produtos publicados.'}
                </p>
                {activeCount > 0 ? (
                  <button className={styles.emptyBtn} onClick={clearAll}>
                    Limpar filtros
                  </button>
                ) : (
                  <Link href="/loja" className={styles.emptyBtn}>
                    Ver todos os produtos
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  {visible.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasMore && (
                  <div className={styles.loadMoreWrapper}>
                    <button
                      className={styles.loadMoreBtn}
                      onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    >
                      carregar mais ({visible.length} de {filtered.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <CartToast />
    </>
  );
}
