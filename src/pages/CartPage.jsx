import { useState } from 'react';
import { Minus, Plus, X, Package, Clock, ShieldCheck, ShoppingBag } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import ProductCard from '../components/ui/ProductCard';
import Link from '../components/ui/Link';
import BuyModal from '../components/ui/BuyModal';
import { useCatalog } from '../data/CatalogContext';
import { useCart, useCartItems } from '../context/CartContext';
import { money, installment } from '../lib/format';
import styles from './CartPage.module.css';

const FRETE_THRESHOLD = 199;

const STEPS = ['carrinho', 'entrega', 'pagamento'];

export default function CartPage() {
  const { products, loading } = useCatalog();
  const { setQty, removeItem } = useCart();
  const items = useCartItems(products);
  const [comprando, setComprando] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const freteLeft = Math.max(0, FRETE_THRESHOLD - subtotal);

  const cartIds = items.map((i) => i.id);
  const suggestions = products.filter((p) => !cartIds.includes(p.id) && p.image).slice(0, 4);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className={styles.main}>
        <div className={styles.stepsBar}>
          <div className="container">
            <div className={styles.steps}>
              {STEPS.map((label, i) => (
                <div key={label} className={styles.stepItem}>
                  {i > 0 && <span className={styles.stepLine} />}
                  <div className={styles.stepCircleWrap}>
                    <span className={`${styles.stepCircle} ${i === 0 ? styles.stepActive : ''}`}>
                      {i + 1}
                    </span>
                    <span className={`${styles.stepLabel} ${i === 0 ? styles.stepLabelActive : ''}`}>
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className={styles.content}>
          <div className="container">
            <div className={styles.grid}>
              <div>
                <div className={styles.cartHeader}>
                  <h1 className={styles.cartTitle}>
                    seu <em className={styles.cartTitleItalic}>carrinho.</em>
                  </h1>
                  {items.length > 0 && (
                    <p className={styles.cartSub}>
                      {items.reduce((s, i) => s + i.qty, 0)}{' '}
                      {items.reduce((s, i) => s + i.qty, 0) === 1 ? 'item' : 'itens'}
                      {freteLeft > 0
                        ? ` · faltam ${money(freteLeft)} para o frete grátis`
                        : ' · você ganhou frete grátis 🎉'}
                    </p>
                  )}
                </div>

                {loading && items.length === 0 ? (
                  <p className={styles.loadingText}>Carregando seu carrinho…</p>
                ) : items.length === 0 ? (
                  <div className={styles.empty}>
                    <span className={styles.emptyIcon}>
                      <ShoppingBag size={30} />
                    </span>
                    <p className={styles.emptyTitle}>Seu carrinho está vazio</p>
                    <p className={styles.emptyText}>
                      Adicione produtos e eles aparecem aqui — salvos mesmo se você fechar a página.
                    </p>
                    <Link href="/loja" className={styles.emptyBtn}>
                      Ver produtos
                    </Link>
                  </div>
                ) : (
                  <div className={styles.itemsList}>
                    {items.map((item, idx) => (
                      <div
                        key={`${item.id}-${item.variantId}`}
                        className={`${styles.itemRow} ${idx < items.length - 1 ? styles.itemRowBorder : ''}`}
                      >
                        <Link href={`/produto/${item.id}`} className={styles.itemImage}>
                          {item.product.image ? (
                            <img src={item.product.image} alt={item.product.name} />
                          ) : (
                            <span>sem foto</span>
                          )}
                        </Link>

                        <div className={styles.itemInfo}>
                          <Link href={`/produto/${item.id}`} className={styles.itemName}>
                            {item.product.name}
                          </Link>
                          {item.variant && item.variant.label !== 'Único' && (
                            <p className={styles.itemVariant}>{item.variant.label}</p>
                          )}
                          <p className={styles.itemUnit}>{money(item.unit)} cada</p>
                        </div>

                        <div className={styles.itemRight}>
                          <div className={styles.qtyPill}>
                            <button
                              className={styles.qtyBtn}
                              onClick={() => setQty(item.id, item.variantId, item.qty - 1)}
                              aria-label="Diminuir"
                            >
                              <Minus size={12} />
                            </button>
                            <span className={styles.qtyVal}>{item.qty}</span>
                            <button
                              className={styles.qtyBtn}
                              onClick={() => setQty(item.id, item.variantId, item.qty + 1)}
                              aria-label="Aumentar"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className={styles.itemPrice}>{money(item.subtotal)}</span>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeItem(item.id, item.variantId)}
                          >
                            remover <X size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Summary ── */}
              {items.length > 0 && (
                <div className={styles.summary}>
                  <h2 className={styles.summaryTitle}>resumo</h2>

                  <div className={styles.summaryLines}>
                    <div className={styles.summaryLine}>
                      <span>
                        {items.length} {items.length === 1 ? 'produto' : 'produtos'}
                      </span>
                      <span>{money(subtotal)}</span>
                    </div>
                  </div>

                  <div className={styles.summaryDivider} />

                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>subtotal</span>
                    <span className={styles.totalValue}>{money(subtotal)}</span>
                  </div>
                  <p className={styles.installments}>ou {installment(subtotal)} sem juros</p>

                  <p className={styles.freteNote}>
                    O frete é calculado pelo seu CEP na loja oficial, na hora de fechar o pedido.
                  </p>

                  <button
                    className={styles.ctaBtn}
                    onClick={() => setComprando(true)}
                    disabled={!items.length}
                  >
                    finalizar compra →
                  </button>

                  <Link href="/loja" className={styles.keepShopping}>
                    continuar comprando
                  </Link>

                  <div className={styles.summaryBenefits}>
                    <span>
                      <ShieldCheck size={12} /> pagamento seguro na loja oficial
                    </span>
                    <span>
                      <Clock size={12} /> envio em 24h úteis
                    </span>
                    <span>
                      <Package size={12} /> frete grátis acima de {money(FRETE_THRESHOLD)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {suggestions.length > 0 && (
          <section className={styles.suggestionsSection}>
            <div className="container">
              <h2 className={styles.suggestionsTitle}>
                aproveite e leve <em className={styles.suggestionsItalic}>junto.</em>
              </h2>
              <div className={styles.suggestionsGrid}>
                {suggestions.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {/* O carrinho inteiro vai junto: o modal pede os tres dados que a
          Nuvemshop exige e devolve o link do checkout ja montado. */}
      <BuyModal
        aberto={comprando}
        aoFechar={() => setComprando(false)}
        total={subtotal}
        itens={items.map((i) => ({
          variantId: i.variant?.id ?? i.variantId,
          quantity: i.qty,
          nome: i.product.name,
          subtotal: i.subtotal,
        }))}
      />
    </>
  );
}
