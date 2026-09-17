import { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, Leaf, ChevronRight } from 'lucide-react';
import styles from './Header.module.css';
import Link from '../ui/Link';
import { navigate } from '../../lib/router';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useCatalog } from '../../data/CatalogContext';

/**
 * Cabeçalho no formato de marketplace: a busca é o elemento principal e fica
 * sempre visível, não escondida atrás de uma lupa. Abaixo dela, uma faixa de
 * categorias que desliza com o dedo.
 */
export default function Header() {
  const { categories } = useCatalog();
  const { favoritesCount } = useFavorites();
  const { count: cartCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [term, setTerm] = useState('');
  const headerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Fecha o menu ao voltar/avançar no navegador.
  useEffect(() => {
    const fechar = () => setMobileOpen(false);
    window.addEventListener('popstate', fechar);
    return () => window.removeEventListener('popstate', fechar);
  }, []);

  function submitSearch(e) {
    e?.preventDefault();
    const q = term.trim();
    if (!q) return;
    setMobileOpen(false);
    navigate(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.top}>
        <div className={`container ${styles.topInner}`}>
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
            <span className={styles.logoIcon}>
              <Leaf size={16} strokeWidth={2.4} />
            </span>
            <span className={styles.logoText}>
              natura<em>vita</em>
            </span>
          </Link>

          <form onSubmit={submitSearch} className={styles.search}>
            <Search size={17} strokeWidth={2} className={styles.searchIcon} />
            <input
              type="search"
              inputMode="search"
              placeholder="Buscar suplementos, vitaminas, naturais…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              aria-label="Buscar produtos"
            />
            <button type="submit" className={styles.searchGo} aria-label="Buscar">
              <Search size={17} strokeWidth={2.4} />
            </button>
          </form>

          <div className={styles.actions}>
            <Link href="/favoritos" className={styles.iconBtn} aria-label="Favoritos">
              <Heart size={20} strokeWidth={1.9} />
              {favoritesCount > 0 && <span className={styles.badge}>{favoritesCount}</span>}
            </Link>
            <Link href="/carrinho" className={styles.iconBtn} aria-label="Carrinho">
              <ShoppingCart size={20} strokeWidth={1.9} />
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Busca em linha própria no celular: no topo ela espremia o logo. */}
      <div className={styles.searchMobileWrap}>
        <form onSubmit={submitSearch} className={styles.searchMobile}>
          <Search size={17} strokeWidth={2} className={styles.searchIcon} />
          <input
            type="search"
            inputMode="search"
            placeholder="O que você procura?"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Buscar produtos"
          />
        </form>
      </div>

      <nav className={styles.chipsBar} aria-label="Categorias">
        <div className={`container ${styles.chipsInner}`}>
          <div className={`rail ${styles.chips}`}>
            <Link href="/loja" className={styles.chipStrong}>
              Todos os produtos
            </Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/${c.slug}`} className={styles.chip}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div className={styles.scrim} onClick={() => setMobileOpen(false)} />
          <div className={styles.drawer} role="dialog" aria-label="Menu">
            <div className={styles.drawerHead}>
              <span className={styles.drawerTitle}>Categorias</span>
              <button
                className={styles.drawerClose}
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <Link href="/loja" className={styles.drawerAll} onClick={() => setMobileOpen(false)}>
              Ver todos os produtos
              <ChevronRight size={17} />
            </Link>

            <div className={styles.drawerList}>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/${c.slug}`}
                  className={styles.drawerItem}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{c.name}</span>
                  <span className={styles.drawerCount}>{c.count}</span>
                </Link>
              ))}
            </div>

            <div className={styles.drawerFoot}>
              <Link href="/favoritos" className="btn btn-outline btn-sm btn-block" onClick={() => setMobileOpen(false)}>
                <Heart size={15} /> Favoritos{favoritesCount > 0 ? ` (${favoritesCount})` : ''}
              </Link>
              <Link href="/carrinho" className="btn btn-primary btn-sm btn-block" onClick={() => setMobileOpen(false)}>
                <ShoppingCart size={15} /> Carrinho{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
