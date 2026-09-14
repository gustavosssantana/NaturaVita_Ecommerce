import { useState, useRef, useEffect } from 'react';
import {
  Search, Heart, User, ShoppingCart, ChevronDown,
  Menu, X, Leaf, Package, MapPin, Settings, LogOut,
} from 'lucide-react';
import styles from './Header.module.css';
import { useFavorites } from '../../context/FavoritesContext';

const navLinks = [
  { label: 'Loja',      href: '/loja',       hasDropdown: true },
  { label: 'Whey',      href: '/whey' },
  { label: 'Pré-treino',href: '/pre-treino' },
  { label: 'Granel',    href: '/granel' },
];

const mockUser = {
  name: 'João Costa',
  initials: 'JC',
  email: 'joao.costa@email.com',
};

function navigate(path) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function Header() {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [cartCount]                   = useState(2);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const profileRef = useRef(null);
  const searchRef  = useRef(null);
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>

        {/* ── Logo ── */}
        <a href="/" className={styles.logo}>
          <span className={styles.logoIcon}><Leaf size={17} strokeWidth={2.3} /></span>
          <span className={styles.logoText}>
            natura<em className={styles.logoVita}>vita</em>
          </span>
        </a>

        {/* ── Nav ── */}
        <nav className={`${styles.nav} ${mobileOpen ? styles.open : ''}`}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
              {link.hasDropdown && (
                <ChevronDown size={10} strokeWidth={2.5} className={styles.chevron} />
              )}
            </a>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div className={styles.actions}>

          {/* Search — expands inline */}
          <div
            className={`${styles.searchWrap} ${searchOpen ? styles.searchExpanded : ''}`}
            ref={searchRef}
          >
            <Search
              size={16}
              strokeWidth={1.9}
              className={styles.searchIcon}
              onClick={() => setSearchOpen(true)}
            />
            <input
              type="search"
              placeholder="Buscar produtos..."
              className={styles.searchInput}
              onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
              tabIndex={searchOpen ? 0 : -1}
            />
          </div>

          <div className={styles.divider} />

          {/* Favorites */}
          <button
            className={`${styles.iconBtn} ${styles.heartBtn}`}
            aria-label="Favoritos"
            onClick={() => navigate('/favoritos')}
          >
            <Heart size={17} strokeWidth={1.9} />
            {favoritesCount > 0 && <span className={styles.dot}>{favoritesCount}</span>}
          </button>

          {/* Profile */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button
              className={`${styles.iconBtn} ${profileOpen ? styles.iconBtnActive : ''}`}
              aria-label="Conta"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <User size={17} strokeWidth={1.9} />
            </button>

            {profileOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.pdHeader}>
                  <div className={styles.pdAvatar}>{mockUser.initials}</div>
                  <div>
                    <p className={styles.pdName}>{mockUser.name}</p>
                    <p className={styles.pdEmail}>{mockUser.email}</p>
                  </div>
                </div>

                <ul className={styles.pdList}>
                  {[
                    { icon: <User size={14}/>,    label: 'Minha Conta',    action: () => navigate('/perfil') },
                    { icon: <Package size={14}/>,  label: 'Meus Pedidos',   action: () => navigate('/perfil') },
                    { icon: <Heart size={14}/>,    label: 'Favoritos',      action: () => navigate('/favoritos'), count: favoritesCount },
                    { icon: <MapPin size={14}/>,   label: 'Endereços',      action: null },
                    { icon: <Settings size={14}/>, label: 'Configurações',  action: () => navigate('/configuracoes') },
                  ].map(({ icon, label, action, count }) => (
                    <li key={label}>
                      <button
                        className={styles.pdItem}
                        onClick={() => { action?.(); setProfileOpen(false); }}
                      >
                        <span className={styles.pdItemIcon}>{icon}</span>
                        {label}
                        {count > 0 && <span className={styles.pdCount}>{count}</span>}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className={styles.pdDivider} />

                <ul className={styles.pdList} style={{ paddingBottom: 8 }}>
                  <li>
                    <button
                      className={`${styles.pdItem} ${styles.pdLogout}`}
                      onClick={() => { alert('Saindo...'); setProfileOpen(false); }}
                    >
                      <span className={styles.pdItemIcon}><LogOut size={14} /></span>
                      Sair
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Cart pill */}
          <button
            className={styles.cartPill}
            aria-label="Carrinho"
            onClick={() => navigate('/carrinho')}
          >
            <ShoppingCart size={15} strokeWidth={2} />
            <span className={styles.cartLabel}>Carrinho</span>
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </button>

          {/* Mobile toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
