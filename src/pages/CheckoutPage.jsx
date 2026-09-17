import { useState } from 'react';
import { Truck, ShieldCheck, ExternalLink, Search, Check } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Link from '../components/ui/Link';
import { useCatalog } from '../data/CatalogContext';
import { useCartItems } from '../context/CartContext';
import { money, buyUrl, deliveryEstimate } from '../lib/format';
import styles from './CheckoutPage.module.css';

const STEPS = ['carrinho', 'entrega', 'pagamento'];

function onlyDigits(v) {
  return (v || '').replace(/\D/g, '');
}

function maskCep(v) {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export default function CheckoutPage() {
  const { products, store } = useCatalog();
  const items = useCartItems(products);

  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [cepError, setCepError] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [opened, setOpened] = useState(() => new Set());

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const prazo = deliveryEstimate(address?.uf);

  async function lookupCep(e) {
    e?.preventDefault();
    const digits = onlyDigits(cep);
    if (digits.length !== 8) {
      setCepError('Digite um CEP com 8 números.');
      setAddress(null);
      return;
    }

    setLookingUp(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setAddress(null);
        setCepError('CEP não encontrado. Confira os números.');
      } else {
        setAddress({
          street: data.logradouro,
          district: data.bairro,
          city: data.localidade,
          uf: data.uf,
          cep: data.cep,
        });
      }
    } catch {
      setCepError('Não conseguimos consultar o CEP agora. Tente de novo.');
      setAddress(null);
    } finally {
      setLookingUp(false);
    }
  }

  function markOpened(id) {
    setOpened((prev) => new Set(prev).add(id));
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className="container">
            <div className={styles.empty}>
              <h1 className={styles.emptyTitle}>Não há nada para finalizar</h1>
              <p className={styles.emptyText}>
                Seu carrinho está vazio. Escolha seus produtos e volte aqui para concluir a compra.
              </p>
              <Link href="/loja" className={styles.emptyBtn}>
                Ver produtos
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.stepsBar}>
          <div className="container">
            <div className={styles.steps}>
              {STEPS.map((label, i) => (
                <div key={label} className={styles.stepItem}>
                  {i > 0 && <span className={`${styles.stepLine} ${i <= 1 ? styles.stepLineDone : ''}`} />}
                  <div className={styles.stepCircleWrap}>
                    <span
                      className={`${styles.stepCircle} ${i === 1 ? styles.stepActive : ''} ${i < 1 ? styles.stepDone : ''}`}
                    >
                      {i < 1 ? <Check size={12} /> : i + 1}
                    </span>
                    <span className={`${styles.stepLabel} ${i === 1 ? styles.stepLabelActive : ''}`}>
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
            <h1 className={styles.title}>
              finalizar <em className={styles.titleItalic}>compra.</em>
            </h1>

            <div className={styles.grid}>
              <div className={styles.left}>
                {/* ── CEP ── */}
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <Truck size={15} /> Conferir prazo de entrega
                  </h2>
                  <p className={styles.cardDesc}>
                    Informe seu CEP para ver a região e o prazo estimado.
                  </p>

                  <form className={styles.cepForm} onSubmit={lookupCep}>
                    <input
                      className={styles.cepInput}
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => {
                        setCep(maskCep(e.target.value));
                        setCepError('');
                      }}
                      inputMode="numeric"
                      autoComplete="postal-code"
                    />
                    <button type="submit" className={styles.cepBtn} disabled={lookingUp}>
                      {lookingUp ? (
                        'buscando…'
                      ) : (
                        <>
                          <Search size={15} /> buscar
                        </>
                      )}
                    </button>
                  </form>

                  {cepError && <p className={styles.cepError}>{cepError}</p>}

                  {address && (
                    <div className={styles.addressBox}>
                      <p className={styles.addressLine}>
                        {address.street ? `${address.street}, ` : ''}
                        {address.district}
                      </p>
                      <p className={styles.addressCity}>
                        {address.city} — {address.uf} · CEP {address.cep}
                      </p>
                      {prazo && (
                        <div className={styles.shippingRow}>
                          <span className={styles.shippingLabel}>Prazo estimado</span>
                          <span className={styles.shippingTime}>{prazo}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className={styles.cepNote}>
                    O valor exato do frete é calculado na página de cada produto, junto com as
                    opções de envio para o seu CEP.
                  </p>
                </div>

                {/* ── Itens com botão de compra ── */}
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Seus itens</h2>
                  <p className={styles.cardDesc}>
                    Clique em comprar para abrir o item na loja oficial e finalizar o pagamento com
                    Pix, boleto ou cartão.
                  </p>

                  <div className={styles.itemList}>
                    {items.map((item) => {
                      const url = buyUrl(store?.url, item.product);
                      const done = opened.has(item.id);
                      return (
                        <div key={`${item.id}-${item.variantId}`} className={styles.item}>
                          <span className={styles.itemThumb}>
                            {item.product.image ? (
                              <img src={item.product.image} alt="" />
                            ) : (
                              <span className={styles.noThumb} />
                            )}
                            <span className={styles.itemQty}>{item.qty}</span>
                          </span>

                          <div className={styles.itemInfo}>
                            <p className={styles.itemName}>{item.product.name}</p>
                            <span className={styles.itemPrice}>{money(item.subtotal)}</span>
                          </div>

                          {url ? (
                            <a
                              className={`${styles.itemBuy} ${done ? styles.itemBuyDone : ''}`}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => markOpened(item.id)}
                            >
                              {done ? (
                                <>
                                  <Check size={14} /> aberto
                                </>
                              ) : (
                                <>
                                  comprar <ExternalLink size={13} />
                                </>
                              )}
                            </a>
                          ) : (
                            <span className={styles.itemUnavailable}>indisponível</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Link href="/carrinho" className={styles.editCart}>
                    editar carrinho
                  </Link>
                </div>
              </div>

              {/* ── Resumo ── */}
              <aside className={styles.summary}>
                <h2 className={styles.summaryTitle}>resumo</h2>

                <div className={styles.summaryLines}>
                  <div className={styles.summaryLine}>
                    <span>
                      {items.length} {items.length === 1 ? 'item' : 'itens'}
                    </span>
                    <span>{money(subtotal)}</span>
                  </div>
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>total</span>
                  <span className={styles.totalValue}>{money(subtotal)}</span>
                </div>
                <p className={styles.installments}>
                  {'frete calculado na loja pelo seu CEP'}
                </p>

                <p className={styles.secureNote}>
                  <ShieldCheck size={13} />
                  O pagamento acontece na loja oficial Natura Vita, com certificado de segurança.
                  Seus dados de cartão nunca passam por este site.
                </p>

                {store?.url && (
                  <a
                    className={styles.storeLink}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    abrir a loja oficial <ExternalLink size={12} />
                  </a>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
