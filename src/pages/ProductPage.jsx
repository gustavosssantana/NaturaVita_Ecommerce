import { useState } from 'react';
import { Minus, Plus, Package, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StarRating from '../components/ui/StarRating';
import { productFlavors, productHighlights, productDescription } from '../data/mockData';
import { useCatalog } from '../data/CatalogContext';
import styles from './ProductPage.module.css';

const TABS = ['Descrição', 'Tabela nutricional', 'Como usar', 'Reviews', 'FAQ'];
const THUMBS = [0, 1, 2, 3];

export default function ProductPage({ productId }) {
  const { products, categories, loading } = useCatalog();
  const product = products.find((p) => p.id === productId) || products[0] || null;

  const flavors = product ? (productFlavors[product.category] || ['Natural']) : ['Natural'];
  const highlights = product ? (productHighlights[product.category] || []) : [];

  const [selectedFlavor, setSelectedFlavor] = useState(
    flavors.find((f) => f.toLowerCase() === product?.flavor) || flavors[0]
  );
  const [selectedSize, setSelectedSize] = useState(product?.variants?.[0]);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);

  if (!product) {
    return (
      <>
        <Header />
        <main>
          <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
            <p>{loading ? 'Carregando produto…' : 'Produto não encontrado.'}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const category = categories.find((c) => c.slug === product.category);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const totalPrice = (product.price * qty).toFixed(2).replace('.', ',');
  const installment = (product.price / 6).toFixed(2).replace('.', ',');

  const related = products
    .filter((p) => p.category !== product.category)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main>

        {/* ── Breadcrumb ── */}
        <div className={styles.breadcrumbBar}>
          <div className="container">
            <nav className={styles.breadcrumb}>
              <a href="/loja">Loja</a>
              <span>›</span>
              <a href={`/${product.category}`}>{category?.name}</a>
              <span>›</span>
              <span className={styles.breadcrumbCurrent}>{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ── Main Product ── */}
        <section className={styles.productSection}>
          <div className="container">
            <div className={styles.productGrid}>

              {/* Gallery */}
              <div className={styles.gallery}>
                <div className={styles.thumbStrip}>
                  {THUMBS.map((i) => {
                    const src = product.images?.[i] || product.image;
                    return (
                      <div
                        key={i}
                        className={`${styles.thumb} ${activeThumb === i ? styles.thumbActive : ''} ${src ? '' : 'img-placeholder'}`}
                        onClick={() => setActiveThumb(i)}
                      >
                        {src ? (
                          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span>v{i + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className={`${styles.mainImage} ${product.image ? '' : 'img-placeholder'}`}>
                  {(product.images?.[activeThumb] || product.image) ? (
                    <img
                      src={product.images?.[activeThumb] || product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span>produto</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className={styles.productInfo}>

                <p className={styles.productTag}>
                  <span className={styles.tagDot} />
                  {category?.name}{product.type ? ` · ${product.type}` : ''}
                </p>

                <h1 className={styles.productName}>{product.name}</h1>
                <div className={styles.ratingRow}>
                  <StarRating rating={product.rating} size={13} />
                  <span className={styles.ratingValue}>{product.rating}</span>
                  <span className={styles.ratingCount}>· {product.reviews.toLocaleString('pt-BR')} reviews</span>
                </div>

                <div className={styles.priceBlock}>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>R$ {product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className={styles.originalPrice}>R$ {product.originalPrice}</span>
                        <span className={styles.discountBadge}>{discountPct}%</span>
                      </>
                    )}
                  </div>
                  <p className={styles.installments}>
                    ou 6x R${installment} sem juros
                  </p>
                </div>

                <hr className={styles.divider} />

                {/* Flavor */}
                <div className={styles.optionGroup}>
                  <p className={styles.optionLabel}>Sabor</p>
                  <div className={styles.optionPills}>
                    {flavors.map((f) => (
                      <button
                        key={f}
                        className={`${styles.optionPill} ${selectedFlavor === f ? styles.flavorActive : ''}`}
                        onClick={() => setSelectedFlavor(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className={styles.optionGroup}>
                  <p className={styles.optionLabel}>Tamanho</p>
                  <div className={styles.optionPills}>
                    {product.variants.map((v) => (
                      <button
                        key={v}
                        className={`${styles.optionPill} ${selectedSize === v ? styles.sizeActive : ''}`}
                        onClick={() => setSelectedSize(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purchase */}
                <div className={styles.purchaseRow}>
                  <div className={styles.qtyControl}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      <Minus size={13} />
                    </button>
                    <span className={styles.qtyValue}>{qty}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => setQty((q) => q + 1)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <button className={styles.addToCartBtn}>
                    adicionar ao carrinho · R$ {totalPrice}
                  </button>
                </div>

                <button className={styles.buyNowBtn} onClick={() => { window.location.href = '/carrinho'; }}>comprar agora →</button>

                {/* Benefits */}
                <div className={styles.benefits}>
                  <div className={styles.benefit}>
                    <Package size={13} strokeWidth={2} />
                    <span>Frete grátis acima de R$199</span>
                  </div>
                  <div className={styles.benefit}>
                    <Clock size={13} strokeWidth={2} />
                    <span>Envio em 24h</span>
                  </div>
                  <div className={styles.benefit}>
                    <RefreshCw size={13} strokeWidth={2} />
                    <span>Troca grátis em 30 dias</span>
                  </div>
                  <div className={styles.benefit}>
                    <ShieldCheck size={13} strokeWidth={2} />
                    <span>Lacrado · ANVISA</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── Tabs ── */}
        <section className={styles.tabsSection}>
          <div className="container">
            <div className={styles.tabsBar}>
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  className={`${styles.tabBtn} ${activeTab === i ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab === 'Reviews' ? `Reviews (${product.reviews.toLocaleString('pt-BR')})` : tab}
                </button>
              ))}
            </div>

            <div className={styles.tabBody}>
              {activeTab === 0 ? (
                <div className={styles.descGrid}>
                  <div className={styles.descText}>
                    <p>{productDescription}</p>
                  </div>
                  <div className={styles.highlightsBox}>
                    <h3 className={styles.highlightsTitle}>destaques</h3>
                    <ul className={styles.highlightsList}>
                      {highlights.map((h) => (
                        <li key={h} className={styles.highlightItem}>
                          <span className={styles.checkmark}>✓</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className={styles.tabPlaceholder}>
                  <p>Conteúdo em breve.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Combina com ── */}
        <section className={styles.relatedSection}>
          <div className="container">
            <h2 className={styles.relatedTitle}>
              combina <em className={styles.relatedItalic}>com.</em>
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <a key={p.id} href={`/produto/${p.id}`} className={styles.relatedCard}>
                  <div className={`${styles.relatedImage} ${p.image ? '' : 'img-placeholder'}`}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>produto</span>
                    )}
                  </div>
                  <div className={styles.relatedMeta}>
                    <p className={styles.relatedName}>{p.name}</p>
                    <div className={styles.relatedRow}>
                      <span className={styles.relatedPrice}>R$ {p.price}</span>
                      <StarRating rating={p.rating} size={11} />
                    </div>
                  </div>
                  <button
                    className={styles.relatedAddBtn}
                    onClick={(e) => e.preventDefault()}
                  >
                    + adicionar
                  </button>
                </a>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
