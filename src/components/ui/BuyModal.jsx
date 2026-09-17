import { useEffect, useRef, useState } from 'react';
import { X, Loader2, ShieldCheck } from 'lucide-react';
import { money } from '../../lib/format';
import styles from './BuyModal.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const GUARDADO = 'naturavita:comprador';

/**
 * Pede os três dados que a Nuvemshop exige para montar o pedido (e-mail, nome
 * e sobrenome), cria o rascunho pelo /api/checkout e leva o cliente ao
 * checkout da loja com o carrinho inteiro.
 *
 * `itens`: [{ variantId, quantity, nome, subtotal }]
 */
export default function BuyModal({ aberto, aoFechar, itens = [], total = 0 }) {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const primeiroCampo = useRef(null);

  // Quem já comprou uma vez não redigita: os dados ficam no navegador dele.
  useEffect(() => {
    if (!aberto) return;
    try {
      const salvo = JSON.parse(localStorage.getItem(GUARDADO) || '{}');
      if (salvo.email) setEmail(salvo.email);
      if (salvo.nome) setNome(salvo.nome);
      if (salvo.sobrenome) setSobrenome(salvo.sobrenome);
    } catch {
      /* navegador sem storage: segue com os campos vazios */
    }
    setErro(null);
    const t = setTimeout(() => primeiroCampo.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => e.key === 'Escape' && !enviando && aoFechar?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aberto, enviando, aoFechar]);

  if (!aberto) return null;

  async function enviar(e) {
    e.preventDefault();
    setErro(null);

    if (!EMAIL_RE.test(email.trim())) return setErro('Confira o e-mail.');
    if (!nome.trim()) return setErro('Informe seu nome.');
    if (!sobrenome.trim()) return setErro('Informe seu sobrenome.');
    if (!itens.length) return setErro('Seu carrinho está vazio.');

    setEnviando(true);
    try {
      localStorage.setItem(
        GUARDADO,
        JSON.stringify({ email: email.trim(), nome: nome.trim(), sobrenome: sobrenome.trim() })
      );
    } catch {
      /* sem storage: apenas não guarda */
    }

    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          nome: nome.trim(),
          sobrenome: sobrenome.trim(),
          itens: itens.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      });
      const dados = await r.json().catch(() => ({}));

      if (!r.ok || !dados.checkoutUrl) {
        setErro(dados.error || 'Não foi possível montar seu pedido. Tente novamente.');
        setEnviando(false);
        return;
      }

      // Mesma aba: o cliente está terminando a compra, não explorando.
      window.location.href = dados.checkoutUrl;
    } catch {
      setErro('Sem conexão com a loja. Verifique sua internet e tente de novo.');
      setEnviando(false);
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={() => !enviando && aoFechar?.()}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="buymodal-titulo"
      >
        <button
          className={styles.fechar}
          onClick={() => !enviando && aoFechar?.()}
          aria-label="Fechar"
          type="button"
        >
          <X size={18} />
        </button>

        <h2 id="buymodal-titulo" className={styles.titulo}>
          Quase lá
        </h2>
        <p className={styles.subtitulo}>
          Precisamos destes dados para preparar seu pedido. O pagamento e o frete
          são na próxima tela.
        </p>

        <ul className={styles.resumo}>
          {itens.slice(0, 4).map((i) => (
            <li key={i.variantId}>
              <span>
                {i.quantity}× {i.nome}
              </span>
              <span>{money(i.subtotal)}</span>
            </li>
          ))}
          {itens.length > 4 && <li className={styles.maisItens}>e mais {itens.length - 4} item(ns)</li>}
          <li className={styles.total}>
            <span>Total</span>
            <span>{money(total)}</span>
          </li>
        </ul>

        <form onSubmit={enviar} className={styles.form} noValidate>
          <label className={styles.campo}>
            <span>E-mail</span>
            <input
              ref={primeiroCampo}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
              disabled={enviando}
            />
          </label>

          <div className={styles.linha}>
            <label className={styles.campo}>
              <span>Nome</span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="given-name"
                disabled={enviando}
              />
            </label>
            <label className={styles.campo}>
              <span>Sobrenome</span>
              <input
                type="text"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                autoComplete="family-name"
                disabled={enviando}
              />
            </label>
          </div>

          {erro && (
            <p className={styles.erro} role="alert">
              {erro}
            </p>
          )}

          <button type="submit" className={styles.enviar} disabled={enviando}>
            {enviando ? (
              <>
                <Loader2 size={16} className={styles.girando} /> preparando seu pedido…
              </>
            ) : (
              'ir para o pagamento'
            )}
          </button>

          <p className={styles.seguro}>
            <ShieldCheck size={13} /> pagamento no ambiente seguro da loja
          </p>
        </form>
      </div>
    </div>
  );
}
