import { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingCart, ChevronDown, Menu, X, Leaf } from 'lucide-react';
import styles from './Header.module.css';
import Link from '../ui/Link';
import { navigate } from '../../lib/router';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useCatalog } from '../../data/CatalogContext';

export default function Header() {
  const { categories } = useCatalog();
  const { favoritesCount } = useFavorites();
  const { count: cartCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const shopRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Top 4 categories get a direct slot in the bar; the rest live in the dropdown.
  const quickLinks = categories.slice(0, 4);

  useEffect(() => {
    const handler = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function submitSearch(e) {
    e?.preventDefault();
    const q = term.trim();
    if (!q) return;
    setSearchOpen(false);
    setMobileOpen(false);
    navigate(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <span className={styles.logoIcon}>
            <Leaf size={17} strokeWidth={2.3} />
          </span>
          <span className={styles.logoText}>
            natura<em className={styles.logoVita}>vita</em>
          </span>
        </Link>

        <nav className={styles.nav}>
          <div className={styles.dropdownWrap} ref={shopRef}>
            <button
              className={styles.navLink}
              onClick={() => setShopOpen((v) => !v)}
              aria-expanded={shopOpen}
            >
              Loja
              <ChevronDown size={10} strokeWidth={2.5} className={styles.chevron} />
            </button>

            {shopOpen && (
              <div className={styles.megaMenu}>
                <Link href="/loja" className={styles.megaAll} onClick={() => setShopOpen(false)}>
                  Ver todos os produtos →
                </Link>
                <div className={styles.megaGrid}>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/${c.slug}`}
                      className={styles.megaItem}
                      onClick={() => setShopOpen(false)}
                    >
                      <span className={styles.megaName}>{c.name}</span>
                      <span className={styles.megaCount}>{c.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {quickLinks.map((c) => (
            <Link key={c.id} href={`/${c.slug}`} className={styles.navLink}>
              {c.name}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <div
            className={`${styles.searchWrap} ${searchOpen ? styles.searchExpanded : ''}`}
            ref={searchRef}
          >
            <button
              type="button"
              className={styles.searchIconBtn}
              aria-label="Buscar produtos"
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 80);
              }}
            >
              <Search size={16} strokeWidth={1.9} />
            </button>
            <form onSubmit={submitSearch} className={styles.searchForm}>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Buscar produtos..."
                className={styles.searchInput}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                tabIndex={searchOpen ? 0 : -1}
              />
            </form>
          </div>

          <span className={styles.divider} />

          <Link href="/favoritos" className={`${styles.iconBtn} ${styles.heartBtn}`} aria-label="Favoritos">
            <Heart size={17} strokeWidth={1.9} />
            {favoritesCount > 0 && <span className={styles.dot}>{favoritesCount}</span>}
          </Link>

          <Link href="/carrinho" className={styles.cartPill} aria-label="Carrinho">
            <ShoppingCart size={15} strokeWidth={2} />
            <span className={styles.cartLabel}>Carrinho</span>
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </Link>

          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobilePanel}>
          <form onSubmit={submitSearch} className={styles.mobileSearch}>
            <Search size={16} strokeWidth={2} />
            <input
              type="search"
              placeholder="Buscar produtos..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit" className={styles.mobileSearchBtn}>
              buscar
            </button>
          </form>

          <Link href="/loja" className={styles.mobileAll} onClick={() => setMobileOpen(false)}>
            Ver todos os produtos →
          </Link>

          <div className={styles.mobileList}>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/${c.slug}`}
                className={styles.mobileItem}
                onClick={() => setMobileOpen(false)}
              >
                {c.name}
                <span className={styles.mobileCount}>{c.count}</span>
              </Link>
            ))}
          </div>

          <div className={styles.mobileFooter}>
            <Link href="/favoritos" className={styles.mobileSecondary} onClick={() => setMobileOpen(false)}>
              <Heart size={15} /> Favoritos {favoritesCount > 0 && `(${favoritesCount})`}
            </Link>
            <Link href="/carrinho" className={styles.mobileSecondary} onClick={() => setMobileOpen(false)}>
              <ShoppingCart size={15} /> Carrinho {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
