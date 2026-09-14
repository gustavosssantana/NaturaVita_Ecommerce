import { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, LayoutGrid, List, X } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { useCatalog } from '../data/CatalogContext';
import styles from './CategoryPage.module.css';

const PAGE_SIZE = 8;

const lojaMeta = { title: 'Nossa', italic: 'loja.', label: 'Loja', desc: 'Todos os produtos NaturaVita em um só lugar.' };

function metaFor(slug, category) {
  if (slug === 'loja' || !category) return lojaMeta;
  return {
    title: category.name,
    italic: '',
    label: category.name,
    desc: `Confira nossa seleção de ${category.name}.`,
  };
}

const filterDefs = [
  { key: 'preco', label: 'Preço', options: ['Até R$100', 'R$100–200', 'Acima de R$200'] },
];

function matchesPrice(price, filter) {
  if (filter === 'Até R$100') return price <= 100;
  if (filter === 'R$100–200') return price > 100 && price <= 200;
  if (filter === 'Acima de R$200') return price > 200;
  return true;
}

export default function CategoryPage({ slug }) {
  const { products, categories, loading } = useCatalog();
  const [activeFilters, setActiveFilters] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [lactoseFree, setLactoseFree] = useState(false);
  const [view, setView] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const category = categories.find((c) => c.slug === slug);
  const meta = metaFor(slug, category);

  const baseProducts = slug === 'loja' ? products : products.filter((p) => p.category === slug);

  const filtered = useMemo(() => {
    return baseProducts.filter((p) => {
      if (activeFilters.preco && !matchesPrice(p.price, activeFilters.preco)) return false;
      if (lactoseFree && !p.lactoseFree) return false;
      return true;
    });
  }, [baseProducts, activeFilters, lactoseFree]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeFilterCount = Object.keys(activeFilters).length + (lactoseFree ? 1 : 0);

  function toggleFilter(key, value) {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (next[key] === value) delete next[key];
      else next[key] = value;
      return next;
    });
    setOpenDropdown(null);
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilter(key) {
    setActiveFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setVisibleCount(PAGE_SIZE);
  }

  function clearAll() {
    setActiveFilters({});
    setLactoseFree(false);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <Header />
      <main>
        {/* ── Page Hero ── */}
        <div className={styles.pageHero}>
          <div className="container">
            <nav className={styles.breadcrumb}>
              <a href="/">Início</a>
              <span className={styles.breadcrumbSep}>/</span>
              <a href="/loja">Loja</a>
              {slug !== 'loja' && (
                <>
                  <span className={styles.breadcrumbSep}>/</span>
                  <span className={styles.breadcrumbCurrent}>{meta.label}</span>
                </>
              )}
            </nav>

            <span className={styles.heroTag}>
              <span className={styles.heroDot} />
              {meta.label}
            </span>

            <h1 className={styles.heroTitle}>
              {meta.title}{' '}
              <em className={styles.heroItalic}>{meta.italic}</em>
            </h1>

            <div className={styles.heroMeta}>
              <p className={styles.heroDesc}>{meta.desc}</p>
              <span className={styles.heroCount}>{filtered.length} produtos</span>
            </div>
          </div>
        </div>

        {/* ── Sticky Filter Bar ── */}
        <div className={styles.filtersBar}>
          <div className="container">
            <div className={styles.filterRow}>
              <div className={styles.filterPills}>
                {filterDefs.map((fd) => (
                  <div
                    key={fd.key}
                    className={styles.dropdownWrap}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`${styles.filterPill} ${activeFilters[fd.key] ? styles.pillActive : ''}`}
                      onClick={() => setOpenDropdown(openDropdown === fd.key ? null : fd.key)}
                    >
                      {activeFilters[fd.key] ? activeFilters[fd.key] : fd.label}
                      {activeFilters[fd.key]
                        ? <X size={12} onClick={(e) => { e.stopPropagation(); clearFilter(fd.key); }} />
                        : <ChevronDown size={12} />
                      }
                    </button>
                    {openDropdown === fd.key && (
                      <div className={styles.dropdown}>
                        {fd.options.map((opt) => (
                          <button
                            key={opt}
                            className={`${styles.dropdownItem} ${activeFilters[fd.key] === opt ? styles.dropdownItemActive : ''}`}
                            onClick={() => toggleFilter(fd.key, opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  className={`${styles.filterPill} ${styles.togglePill} ${lactoseFree ? styles.pillActive : ''}`}
                  onClick={() => { setLactoseFree((v) => !v); setVisibleCount(PAGE_SIZE); }}
                >
                  Sem lactose
                  {lactoseFree && <X size={12} />}
                </button>
              </div>

              <div className={styles.filterRight}>
                {activeFilterCount > 0 && (
                  <button className={styles.clearBtn} onClick={clearAll}>
                    limpar ({activeFilterCount})
                  </button>
                )}
                <button className={styles.allFiltersBtn}>
                  <SlidersHorizontal size={14} />
                  Filtros
                  {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Listing ── */}
        <section className={styles.listing}>
          <div className="container">
            <div className={styles.resultsBar}>
              <p className={styles.resultsCount}>
                <strong>{filtered.length}</strong> produtos encontrados
              </p>
              <div className={styles.resultsControls}>
                <div className={styles.viewToggle}>
                  <button
                    className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
                    onClick={() => setView('grid')}
                    aria-label="Grade"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
                    onClick={() => setView('list')}
                    aria-label="Lista"
                  >
                    <List size={15} />
                  </button>
                </div>
                <button className={styles.sortBtn}>
                  ordenar
                  <ChevronDown size={13} />
                </button>
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className={styles.empty}>
                <p>Carregando produtos…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <p>Nenhum produto encontrado com os filtros selecionados.</p>
                <button className={styles.clearBtn} onClick={clearAll}>Limpar filtros</button>
              </div>
            ) : (
              <>
                <div className={`${styles.grid} ${view === 'list' ? styles.gridList : ''}`}>
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
                      carregar mais ({visibleCount} de {filtered.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
