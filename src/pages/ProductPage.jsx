import { useState, useMemo } from 'react';
import { Minus, Plus, Package, Truck, ShieldCheck, Heart, Check, ShoppingCart } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import StarRating from '../components/ui/StarRating';
import ProductCard from '../components/ui/ProductCard';
import CartToast from '../components/ui/CartToast';
import Link from '../components/ui/Link';
import BuyModal from '../components/ui/BuyModal';
import { useCatalog } from '../data/CatalogContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { money, installment, discountPercent } from '../lib/format';
import styles from './ProductPage.module.css';

export default function ProductPage({ productId }) {
  const { getProduct, categories, products, loading } = useCatalog();
  const { addItem } = useCart();
  const [comprando, setComprando] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const product = getProduct(productId);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id && p.image)
      .slice(0, 4);
  }, [products, product]);

  if (loading && !product) {
    return (
      <>
        <Header />
        <main className={styles.stateWrap}>
          <div className="container">
            <p className={styles.stateText}>Carregando produto…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className={styles.stateWrap}>
          <div className="container">
            <h1 className={styles.stateTitle}>Produto não encontrado</h1>
            <p className={styles.stateText}>
              Esse produto pode ter saído do catálogo ou o link está incorreto.
            </p>
            <Link href="/loja" className={styles.stateBtn}>
              Ver todos os produtos
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const category = categories.find((c) => c.slug === product.category);
  const variant = product.variants?.find((v) => v.id === selectedVariant) || product.variants?.[0] || null;
  const unitPrice = variant?.price || product.price;
  const off = discountPercent(product.price, product.originalPrice);
  const favorited = isFavorite(product.id);
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const hasVariants = (product.variants?.length || 0) > 1;

  function handleAdd() {
    addItem(product, qty, variant?.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className={styles.main}>
        <div className={styles.breadcrumbBar}>
          <div className="container">
            <nav className={styles.breadcrumb}>
              <Link href="/loja">Loja</Link>
              {category && (
                <>
                  <span>›</span>
                  <Link href={`/${category.slug}`}>{category.name}</Link>
                </>
              )}
              <span>›</span>
              <span className={styles.breadcrumbCurrent}>{product.name}</span>
            </nav>
          </div>
        </div>

        <section className={styles.productSection}>
          <div className="container">
            <div className={styles.productGrid}>
              {/* ── Gallery ── */}
              {/* Sem a tira de miniaturas o grid tem um filho só, e ele cairia
                  na coluna estreita reservada para as miniaturas — a foto
                  encolhia para 52px. gallerySingle tira essa coluna. */}
              <div
                className={`${styles.gallery} ${images.length > 1 ? '' : styles.gallerySingle}`}
              >
                {images.length > 1 && (
                  <div className={styles.thumbStrip}>
                    {images.slice(0, 6).map((src, i) => (
                      <button
                        key={src + i}
                        className={`${styles.thumb} ${activeImage === i ? styles.thumbActive : ''}`}
                        onClick={() => setActiveImage(i)}
                        aria-label={`Imagem ${i + 1}`}
                      >
                        <img src={src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}

                <div className={styles.mainImage}>
                  {images[activeImage] ? (
                    <img src={images[activeImage]} alt={product.name} />
                  ) : (
                    <span className={styles.noImage}>sem foto disponível</span>
                  )}
                  {off && <span className={styles.imageBadge}>-{off}%</span>}
                </div>
              </div>

              {/* ── Info ── */}
              <div className={styles.productInfo}>
                {category && (
                  <Link href={`/${category.slug}`} className={styles.productTag}>
                    <span className={styles.tagDot} />
                    {category.name}
                  </Link>
                )}

                <h1 className={styles.productName}>{product.name}</h1>

                <div className={styles.ratingRow}>
                  <StarRating rating={product.rating} size={13} />
                  <span className={styles.ratingValue}>{product.rating}</span>
                  <span className={styles.ratingCount}>
                    · {product.reviews.toLocaleString('pt-BR')} avaliações
                  </span>
                  {product.sku && <span className={styles.sku}>SKU {product.sku}</span>}
                </div>

                <div className={styles.priceBlock}>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{money(unitPrice)}</span>
                    {product.originalPrice && (
                      <>
                        <span className={styles.originalPrice}>{money(product.originalPrice)}</span>
                        <span className={styles.discountBadge}>-{off}%</span>
                      </>
                    )}
                  </div>
                  <p className={styles.installments}>
                    ou {installment(unitPrice)} sem juros
                  </p>
                </div>

                <hr className={styles.divider} />

                {hasVariants && (
                  <div className={styles.optionGroup}>
                    <p className={styles.optionLabel}>Opção</p>
                    <div className={styles.optionPills}>
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          className={`${styles.optionPill} ${variant?.id === v.id ? styles.sizeActive : ''}`}
                          onClick={() => setSelectedVariant(v.id)}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.stockRow}>
                  <span className={product.inStock ? styles.inStock : styles.outStock}>
                    {product.inStock ? '● em estoque' : '● indisponível no momento'}
                  </span>
                </div>

                {/* Quantidade em linha própria, e as duas ações uma embaixo da
                    outra, com a MESMA altura (.btn, do globals.css). Antes cada
                    botão tinha a sua altura e no celular a diferença saltava. */}
                <div className={styles.qtyRow}>
                  <span className={styles.qtyLabel}>Quantidade</span>
                  <div className={styles.qtyControl}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Diminuir quantidade"
                      disabled={qty <= 1}
                    >
                      <Minus size={15} />
                    </button>
                    <span className={styles.qtyValue}>{qty}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <div className={styles.acoes}>
                  {product.inStock && variant?.id && (
                    <button
                      type="button"
                      className="btn btn-accent btn-block"
                      onClick={() => setComprando(true)}
                    >
                      Comprar agora
                    </button>
                  )}

                  <button
                    className={`btn btn-outline btn-block ${added ? styles.addDone : ''}`}
                    onClick={handleAdd}
                    disabled={!product.inStock}
                  >
                    {added ? (
                      <>
                        <Check size={16} /> adicionado
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} /> Adicionar · {money(unitPrice * qty)}
                      </>
                    )}
                  </button>
                </div>

                <button
                  className={`${styles.favBtn} ${favorited ? styles.favBtnActive : ''}`}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart size={14} fill={favorited ? 'currentColor' : 'none'} />
                  {favorited ? 'salvo nos favoritos' : 'salvar nos favoritos'}
                </button>

                {/* Só o que a loja cumpre. Frete grátis e prazo de 24h saíram:
                    o frete é calculado no fechamento, pelo CEP. */}
                <div className={styles.benefits}>
                  <div className={styles.benefit}>
                    <ShieldCheck size={14} strokeWidth={2} />
                    <span>Produto lacrado e original</span>
                  </div>
                  <div className={styles.benefit}>
                    <Truck size={14} strokeWidth={2} />
                    <span>Frete calculado pelo seu CEP</span>
                  </div>
                  <div className={styles.benefit}>
                    <Package size={14} strokeWidth={2} />
                    <span>Entrega para todo o Brasil</span>
                  </div>
                  <div className={styles.benefit}>
                    <ShieldCheck size={14} strokeWidth={2} />
                    <span>Pagamento seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {product.description && (
          <section className={styles.tabsSection}>
            <div className="container">
              <h2 className={styles.descTitle}>descrição</h2>
              <div className={styles.descBody}>
                <p>{product.description}</p>
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <div className="container">
              <h2 className={styles.relatedTitle}>
                você também pode <em className={styles.relatedItalic}>gostar.</em>
              </h2>
              <div className={styles.relatedGrid}>
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Barra fixa no celular: a ação de compra fica sempre ao alcance do
          polegar, sem precisar rolar de volta. Some no desktop. */}
      <div className={styles.barraFixa}>
        <div className={styles.barraPreco}>
          <span className={styles.barraValor}>{money(unitPrice * qty)}</span>
          <span className={styles.barraQtd}>
            {qty} {qty === 1 ? 'unidade' : 'unidades'}
          </span>
        </div>
        {product.inStock && variant?.id ? (
          <button type="button" className="btn btn-accent" onClick={() => setComprando(true)}>
            Comprar agora
          </button>
        ) : (
          <button className="btn btn-outline" onClick={handleAdd} disabled={!product.inStock}>
            <ShoppingCart size={16} /> adicionar
          </button>
        )}
      </div>

      <Footer />
      <CartToast />

      {/* Os tres dados que a Nuvemshop exige para montar o pedido. */}
      <BuyModal
        aberto={comprando}
        aoFechar={() => setComprando(false)}
        total={unitPrice * qty}
        itens={[
          {
            variantId: variant?.id,
            quantity: qty,
            nome: product.name,
            subtotal: unitPrice * qty,
          },
        ]}
      />
    </>
  );
}
