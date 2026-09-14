import { useState } from 'react';
import { Truck, ShieldCheck, Lock, ExternalLink, Search, Check } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Link from '../components/ui/Link';
import { useCatalog } from '../data/CatalogContext';
import { useCartItems } from '../context/CartContext';
import { money, installment, cartCheckoutUrl, deliveryEstimate } from '../lib/format';
import styles from './CheckoutPage.module.css';

const FRETE_THRESHOLD = 199;
const FRETE_COST = 19.9;
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

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const frete = subtotal >= FRETE_THRESHOLD ? 0 : FRETE_COST;
  const total = subtotal + frete;
  const checkoutUrl = cartCheckoutUrl(store?.url, items);
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
              entrega e <em className={styles.titleItalic}>pagamento.</em>
            </h1>

            <div className={styles.grid}>
              <div className={styles.left}>
                {/* ── CEP ── */}
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <Truck size={15} /> Onde você quer receber?
                  </h2>
                  <p className={styles.cardDesc}>
                    Informe seu CEP para conferir a região e o prazo estimado de entrega.
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
                          <Search size={14} /> buscar
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
                      <div className={styles.shippingRow}>
                        <span className={styles.shippingLabel}>
                          {frete === 0 ? 'Frete grátis' : `Frete estimado ${money(frete)}`}
                        </span>
                        {prazo && <span className={styles.shippingTime}>chega em {prazo}</span>}
                      </div>
                    </div>
                  )}

                  <p className={styles.cepNote}>
                    O endereço completo e o valor final do frete são confirmados na etapa de
                    pagamento, junto com as opções de envio disponíveis para o seu CEP.
                  </p>
                </div>

                {/* ── Itens ── */}
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Itens do pedido</h2>
                  <div className={styles.itemList}>
                    {items.map((item) => (
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
                          {item.variant && item.variant.label !== 'Único' && (
                            <p className={styles.itemVariant}>{item.variant.label}</p>
                          )}
                        </div>
                        <span className={styles.itemPrice}>{money(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/carrinho" className={styles.editCart}>
                    editar carrinho
                  </Link>
                </div>
              </div>

              {/* ── Resumo / finalização ── */}
              <aside className={styles.summary}>
                <h2 className={styles.summaryTitle}>resumo</h2>

                <div className={styles.summaryLines}>
                  <div className={styles.summaryLine}>
                    <span>subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className={styles.summaryLine}>
                    <span>frete estimado</span>
                    <span className={frete === 0 ? styles.freteFree : ''}>
                      {frete === 0 ? 'grátis' : money(frete)}
                    </span>
                  </div>
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>total</span>
                  <span className={styles.totalValue}>{money(total)}</span>
                </div>
                <p className={styles.installments}>ou {installment(total)} sem juros</p>

                {checkoutUrl ? (
                  <a
                    className={styles.payBtn}
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Lock size={15} /> ir para o pagamento
                  </a>
                ) : (
                  <p className={styles.payUnavailable}>
                    Não foi possível abrir o pagamento agora. Recarregue a página e tente de novo.
                  </p>
                )}

                <p className={styles.secureNote}>
                  <ShieldCheck size={13} />
                  Você finaliza no checkout oficial da loja, com Pix, boleto ou cartão. Seus dados
                  de pagamento são processados lá, com certificado de segurança.
                  <ExternalLink size={11} />
                </p>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
