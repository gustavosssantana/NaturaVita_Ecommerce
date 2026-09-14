import { useState, useEffect, useMemo } from 'react';
import { X, Heart, Package, Clock, RefreshCw } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StarRating from '../components/ui/StarRating';
import { useCatalog } from '../data/CatalogContext';
import styles from './CartPage.module.css';

const VALID_COUPONS = {
  'BEMVINDO15':    0.15,
  'NATURAVITA10':  0.10,
};

const FRETE_THRESHOLD = 199;
const FRETE_COST      = 12;

const STEPS = ['carrinho', 'entrega', 'pagamento', 'concluído'];

function buildItems(initialIds, products) {
  return initialIds
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .filter((i) => i.product);
}

export default function CartPage() {
  const { products } = useCatalog();
  const initialIds = useMemo(
    () => products.slice(0, 3).map((p, idx) => ({ productId: p.id, qty: idx === 1 ? 2 : 1 })),
    [products]
  );
  const [items,         setItems]         = useState([]);
  const [couponInput,   setCouponInput]   = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError,   setCouponError]   = useState(false);

  useEffect(() => {
    if (items.length === 0 && initialIds.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(buildItems(initialIds, products));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIds]);

  function updateQty(productId, delta) {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, pct: VALID_COUPONS[code] });
      setCouponError(false);
    } else {
      setAppliedCoupon(null);
      setCouponError(true);
    }
  }

  const subtotal      = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const frete         = subtotal >= FRETE_THRESHOLD ? 0 : FRETE_COST;
  const freteLeft     = Math.max(0, FRETE_THRESHOLD - subtotal);
  const couponAmt     = appliedCoupon ? Math.round(subtotal * appliedCoupon.pct) : 0;
  const total         = subtotal + frete - couponAmt;

  const cartIds       = items.map((i) => i.productId);
  const suggestions   = products.filter((p) => !cartIds.includes(p.id)).slice(0, 4);

  const fmt = (n) => `R$ ${n.toFixed(2).replace('.', ',')}`;

  return (
    <>
      <Header />
      <main className={styles.main}>

        {/* ── Step indicator ── */}
        <div className={styles.stepsBar}>
          <div className="container">
            <div className={styles.steps}>
              {STEPS.map((label, i) => (
                <div key={label} className={styles.stepItem}>
                  {i > 0 && <span className={`${styles.stepLine} ${i <= 0 ? styles.stepLineDone : ''}`} />}
                  <div className={styles.stepCircleWrap}>
                    <span className={`${styles.stepCircle} ${i === 0 ? styles.stepActive : ''}`}>
                      {i === 0 ? '✓' : i + 1}
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

        {/* ── Main content ── */}
        <section className={styles.content}>
          <div className="container">
            <div className={styles.grid}>

              {/* Left — cart items */}
              <div>
                <div className={styles.cartHeader}>
                  <h1 className={styles.cartTitle}>seu <em className={styles.cartTitleItalic}>carrinho.</em></h1>
                  {items.length > 0 && (
                    <p className={styles.cartSub}>
                      {items.reduce((s, i) => s + i.qty, 0)} {items.length === 1 ? 'item' : 'itens'}
                      {freteLeft > 0
                        ? ` · você está R$${freteLeft} do frete grátis`
                        : ' · frete grátis no seu pedido 🎉'}
                    </p>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className={styles.empty}>
                    <p>Seu carrinho está vazio.</p>
                    <a href="/loja" className={styles.emptyLink}>ver produtos →</a>
                  </div>
                ) : (
                  <div className={styles.itemsList}>
                    {items.map((item, idx) => (
                      <div key={item.productId} className={`${styles.itemRow} ${idx < items.length - 1 ? styles.itemRowBorder : ''}`}>
                        <div className={`${styles.itemImage} ${item.product.image ? '' : 'img-placeholder'}`}>
                          {item.product.image ? (
                            <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span>produto</span>
                          )}
                        </div>

                        <div className={styles.itemInfo}>
                          <p className={styles.itemName}>{item.product.name}</p>
                          <p className={styles.itemFlavor}>{item.product.flavor}</p>
                          <button className={styles.subscribeBtn}>
                            <Heart size={11} />
                            assinar e economizar 15%
                          </button>
                        </div>

                        <div className={styles.itemRight}>
                          <div className={styles.qtyPill}>
                            <button className={styles.qtyBtn} onClick={() => updateQty(item.productId, -1)}>−</button>
                            <span className={styles.qtyVal}>{item.qty}</span>
                            <button className={styles.qtyBtn} onClick={() => updateQty(item.productId, +1)}>+</button>
                          </div>
                          <span className={styles.itemPrice}>{fmt(item.product.price * item.qty)}</span>
                          <button className={styles.removeBtn} onClick={() => removeItem(item.productId)}>
                            remover <X size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — summary */}
              <div className={styles.summary}>
                <h2 className={styles.summaryTitle}>resumo</h2>

                <div className={styles.summaryLines}>
                  <div className={styles.summaryLine}>
                    <span>subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div className={styles.summaryLine}>
                    <span>frete</span>
                    <span className={frete === 0 ? styles.freteFree : ''}>
                      {frete === 0 ? 'grátis' : fmt(frete)}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className={`${styles.summaryLine} ${styles.couponLine}`}>
                      <span>cupom ({appliedCoupon.code})</span>
                      <span>− {fmt(couponAmt)}</span>
                    </div>
                  )}
                </div>

                <div className={styles.couponRow}>
                  <input
                    className={`${styles.couponInput} ${couponError ? styles.couponInputError : ''}`}
                    placeholder="código de cupom"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value); setCouponError(false); }}
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <button className={styles.couponBtn} onClick={applyCoupon}>aplicar</button>
                </div>
                {couponError && <p className={styles.couponError}>Cupom inválido</p>}

                <div className={styles.summaryDivider} />

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>total</span>
                  <span className={styles.totalValue}>{fmt(total)}</span>
                </div>
                <p className={styles.installments}>em até 6x sem juros</p>

                <a href="/entrega" className={styles.ctaBtn}>
                  continuar para entrega →
                </a>

                <div className={styles.summaryBenefits}>
                  <span><Package size={12} /> pagamento seguro</span>
                  <span><Clock size={12} /> envio em 24h</span>
                  <span><RefreshCw size={12} /> troca grátis em 30d</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Frequentemente comprados juntos ── */}
        {suggestions.length > 0 && (
          <section className={styles.suggestionsSection}>
            <div className="container">
              <h2 className={styles.suggestionsTitle}>
                frequentemente comprados <em className={styles.suggestionsItalic}>juntos</em>
              </h2>
              <div className={styles.suggestionsGrid}>
                {suggestions.map((p) => (
                  <a key={p.id} href={`/produto/${p.id}`} className={styles.suggCard}>
                    <div className={`${styles.suggImage} ${p.image ? '' : 'img-placeholder'}`}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span>produto</span>
                      )}
                    </div>
                    <div className={styles.suggMeta}>
                      <p className={styles.suggName}>{p.name}</p>
                      <div className={styles.suggRow}>
                        <span className={styles.suggPrice}>R$ {p.price}</span>
                        <StarRating rating={p.rating} size={10} />
                      </div>
                    </div>
                    <button
                      className={styles.suggAddBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        setItems((prev) => {
                          const exists = prev.find((i) => i.productId === p.id);
                          if (exists) return prev.map((i) => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
                          return [...prev, { productId: p.id, qty: 1, product: p }];
                        });
                      }}
                    >
                      + add
                    </button>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
