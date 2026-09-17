import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Lock, Search, Plus, ArrowLeft, Camera, Loader2, Check, AlertCircle, Eye, EyeOff,
  Package,
} from 'lucide-react';
import { money } from '../lib/format';
import styles from './AdminPage.module.css';

const CHAVE = 'naturavita:admin';
const VAZIO = {
  nome: '', descricao: '', preco: '', estoque: '', sku: '',
  categorias: [], publicado: true, foto: null, fotoNome: '',
};

/**
 * Painel do lojista: cria e edita produtos direto na Nuvemshop.
 *
 * A senha nunca decide nada aqui — ela vai em toda chamada e é conferida no
 * servidor. Esconder um botão não protege nada: quem chamar /api/admin sem
 * senha leva 401 do mesmo jeito.
 */
export default function AdminPage() {
  const [senha, setSenha] = useState('');
  const [dentro, setDentro] = useState(false);
  const [erro, setErro] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [totais, setTotais] = useState(null);
  const [alternando, setAlternando] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(null); // produto | 'novo' | null
  const [form, setForm] = useState(VAZIO);
  const [aviso, setAviso] = useState(null);
  const arquivoRef = useRef(null);

  const chamar = useCallback(
    async (acao, dados = {}, senhaUsada) => {
      const r = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao, senha: senhaUsada ?? senha, ...dados }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.erro || 'Falhou. Tente de novo.');
      return j;
    },
    [senha]
  );

  // Sessão guardada só no navegador deste aparelho.
  useEffect(() => {
    let guardada = '';
    try { guardada = sessionStorage.getItem(CHAVE) || ''; } catch { /* sem storage */ }
    if (!guardada) return;
    setSenha(guardada);
    (async () => {
      try {
        await chamar('entrar', {}, guardada);
        setDentro(true);
      } catch {
        try { sessionStorage.removeItem(CHAVE); } catch { /* ignora */ }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregar = useCallback(
    async (termo = '', qual = 'todos') => {
      setOcupado(true);
      setErro(null);
      try {
        const r = await chamar('listar', { busca: termo, filtro: qual });
        setProdutos(r.produtos);
        if (r.totais) setTotais(r.totais);
      } catch (e) {
        setErro(e.message);
      } finally {
        setOcupado(false);
      }
    },
    [chamar]
  );

  // Publicar/ocultar sem sair da lista: é a operação que o lojista mais repete.
  async function alternarPublicacao(p) {
    setAlternando(p.id);
    setErro(null);
    try {
      await chamar('publicacao', { id: p.id, publicado: !p.publicado });
      setProdutos((atual) =>
        atual.map((x) => (x.id === p.id ? { ...x, publicado: !p.publicado } : x))
      );
      setTotais((t) =>
        !t ? t : {
          ...t,
          loja: t.loja + (p.publicado ? -1 : 1),
          ocultos: t.ocultos + (p.publicado ? 1 : -1),
        }
      );
    } catch (e) {
      setErro(e.message);
    } finally {
      setAlternando(null);
    }
  }

  useEffect(() => {
    if (!dentro) return;
    carregar('', 'todos');
    chamar('categorias').then((r) => setCategorias(r.categorias || [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dentro]);

  async function entrar(e) {
    e.preventDefault();
    setErro(null);
    setOcupado(true);
    try {
      await chamar('entrar');
      try { sessionStorage.setItem(CHAVE, senha); } catch { /* sem storage */ }
      setDentro(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setOcupado(false);
    }
  }

  function abrir(p) {
    setAviso(null);
    setErro(null);
    setEditando(p);
    setForm(
      p === 'novo'
        ? { ...VAZIO }
        : {
            nome: p.nome, descricao: p.descricao,
            preco: String(p.precoOriginal || p.preco || ''),
            estoque: p.estoque === null ? '' : String(p.estoque),
            sku: p.sku || '', categorias: p.categorias || [],
            publicado: p.publicado, foto: null, fotoNome: '',
          }
    );
  }

  function escolherFoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 9 * 1024 * 1024) {
      setErro('A imagem é grande demais (máximo 9 MB).');
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => setForm((s) => ({ ...s, foto: leitor.result, fotoNome: f.name }));
    leitor.readAsDataURL(f);
  }

  async function salvar(e) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setOcupado(true);
    try {
      const comum = {
        nome: form.nome, descricao: form.descricao,
        preco: form.preco === '' ? undefined : Number(form.preco),
        estoque: form.estoque === '' ? undefined : Number(form.estoque),
        categorias: form.categorias, publicado: form.publicado,
        foto: form.foto, fotoNome: form.fotoNome,
      };
      const resposta =
        editando === 'novo'
          ? await chamar('criar', { ...comum, sku: form.sku })
          : await chamar('salvar', {
              ...comum, id: editando.id, variantId: editando.variantId,
              removerFotosAntigas: !!form.foto,
            });

      if (resposta.aviso) setAviso(resposta.aviso);
      else setAviso(editando === 'novo' ? 'Produto criado.' : 'Alterações salvas.');
      setEditando(null);
      await carregar(busca, filtro);
    } catch (err) {
      setErro(err.message);
    } finally {
      setOcupado(false);
    }
  }

  // ── login ─────────────────────────────────────────────────────────────────
  if (!dentro) {
    return (
      <main className={styles.loginWrap}>
        <form className={styles.loginBox} onSubmit={entrar}>
          <Lock size={22} className={styles.loginIcone} />
          <h1 className={styles.loginTitulo}>Painel Natura Vita</h1>
          <p className={styles.loginSub}>Acesso restrito ao lojista.</p>
          <input
            type="password" value={senha} onChange={(ev) => setSenha(ev.target.value)}
            placeholder="senha" autoComplete="current-password"
            className={styles.input} disabled={ocupado}
          />
          {erro && <p className={styles.erro} role="alert">{erro}</p>}
          <button type="submit" className={styles.btnPrincipal} disabled={ocupado || !senha}>
            {ocupado ? <Loader2 size={16} className={styles.girando} /> : 'entrar'}
          </button>
        </form>
      </main>
    );
  }

  // ── formulário ────────────────────────────────────────────────────────────
  if (editando) {
    const novo = editando === 'novo';
    return (
      <main className={styles.wrap}>
        <div className={styles.container}>
          <button className={styles.voltar} onClick={() => setEditando(null)} type="button">
            <ArrowLeft size={15} /> voltar
          </button>
          <h1 className={styles.titulo}>{novo ? 'Novo produto' : 'Editar produto'}</h1>

          <form onSubmit={salvar} className={styles.form}>
            <div className={styles.fotoBloco}>
              <div className={styles.fotoPreview}>
                {form.foto ? (
                  <img src={form.foto} alt="" />
                ) : !novo && editando.imagem ? (
                  <img src={editando.imagem} alt="" />
                ) : (
                  <span className={styles.semFoto}>sem foto</span>
                )}
              </div>
              <div>
                <button
                  type="button" className={styles.btnFoto}
                  onClick={() => arquivoRef.current?.click()} disabled={ocupado}
                >
                  <Camera size={15} /> {form.foto ? 'trocar foto' : 'tirar ou escolher foto'}
                </button>
                {/* capture abre a câmera direto no celular */}
                <input
                  ref={arquivoRef} type="file" accept="image/jpeg,image/png,image/webp"
                  capture="environment" onChange={escolherFoto} hidden
                />
                {!novo && form.foto && (
                  <p className={styles.dica}>A foto atual será substituída ao salvar.</p>
                )}
              </div>
            </div>

            <label className={styles.campo}>
              <span>Nome</span>
              <input
                className={styles.input} value={form.nome} disabled={ocupado}
                onChange={(ev) => setForm((s) => ({ ...s, nome: ev.target.value }))}
              />
            </label>

            <label className={styles.campo}>
              <span>Descrição</span>
              <textarea
                className={styles.textarea} rows={5} value={form.descricao} disabled={ocupado}
                onChange={(ev) => setForm((s) => ({ ...s, descricao: ev.target.value }))}
              />
              <small className={styles.dica}>
                Descreva o que o produto <strong>é</strong> — forma, peso, sabor, marca.
                Suplemento não pode prometer efeito (cura, emagrece, imunidade): é regra da ANVISA.
              </small>
            </label>

            <div className={styles.linha3}>
              <label className={styles.campo}>
                <span>Preço (R$)</span>
                <input
                  className={styles.input} type="number" step="0.01" min="0"
                  value={form.preco} disabled={ocupado}
                  onChange={(ev) => setForm((s) => ({ ...s, preco: ev.target.value }))}
                />
              </label>
              <label className={styles.campo}>
                <span>Estoque</span>
                <input
                  className={styles.input} type="number" step="1" min="0"
                  value={form.estoque} disabled={ocupado} placeholder="ilimitado"
                  onChange={(ev) => setForm((s) => ({ ...s, estoque: ev.target.value }))}
                />
              </label>
              {novo && (
                <label className={styles.campo}>
                  <span>Código de barras</span>
                  <input
                    className={styles.input} value={form.sku} disabled={ocupado}
                    onChange={(ev) => setForm((s) => ({ ...s, sku: ev.target.value }))}
                  />
                </label>
              )}
            </div>

            {categorias.length > 0 && (
              <div className={styles.campo}>
                <span>Categorias</span>
                <div className={styles.pills}>
                  {categorias.map((c) => {
                    const on = form.categorias.includes(c.id);
                    return (
                      <button
                        key={c.id} type="button"
                        className={`${styles.pill} ${on ? styles.pillOn : ''}`}
                        onClick={() =>
                          setForm((s) => ({
                            ...s,
                            categorias: on
                              ? s.categorias.filter((x) => x !== c.id)
                              : [...s.categorias, c.id],
                          }))
                        }
                      >
                        {c.nome}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <label className={styles.check}>
              <input
                type="checkbox" checked={form.publicado} disabled={ocupado}
                onChange={(ev) => setForm((s) => ({ ...s, publicado: ev.target.checked }))}
              />
              <span>Mostrar na loja</span>
            </label>

            {erro && <p className={styles.erro} role="alert"><AlertCircle size={14} /> {erro}</p>}

            <button type="submit" className={styles.btnPrincipal} disabled={ocupado}>
              {ocupado ? (
                <><Loader2 size={16} className={styles.girando} /> salvando…</>
              ) : novo ? 'criar produto' : 'salvar alterações'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── lista ─────────────────────────────────────────────────────────────────
  return (
    <main className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.topo}>
          <h1 className={styles.titulo}>Produtos</h1>
          <button className={styles.btnPrincipal} onClick={() => abrir('novo')} type="button">
            <Plus size={16} /> novo produto
          </button>
        </div>

        {aviso && <p className={styles.ok}><Check size={14} /> {aviso}</p>}
        {erro && <p className={styles.erro}><AlertCircle size={14} /> {erro}</p>}

        <div className={styles.abas}>
          {[
            ['todos', 'Todos', totais?.todos],
            ['loja', 'Na loja', totais?.loja],
            ['ocultos', 'Ocultos', totais?.ocultos],
          ].map(([id, rotulo, n]) => (
            <button
              key={id} type="button"
              className={`${styles.aba} ${filtro === id ? styles.abaOn : ''}`}
              onClick={() => { setFiltro(id); carregar(busca, id); }}
            >
              {rotulo}{n !== undefined && <span className={styles.abaNum}>{n}</span>}
            </button>
          ))}
        </div>

        {filtro === 'ocultos' && totais?.ocultosComEstoque > 0 && (
          <p className={styles.destaque}>
            <Package size={14} />
            <span>
              <strong>{totais.ocultosComEstoque}</strong> destes têm estoque — são produtos
              na prateleira que não estão à venda. Aparecem primeiro na lista.
            </span>
          </p>
        )}

        <form
          className={styles.buscaBox}
          onSubmit={(ev) => { ev.preventDefault(); carregar(busca, filtro); }}
        >
          <Search size={15} />
          <input
            className={styles.buscaInput} value={busca} placeholder="buscar por nome ou código"
            onChange={(ev) => setBusca(ev.target.value)}
          />
          <button type="submit" className={styles.btnSecundario} disabled={ocupado}>buscar</button>
        </form>

        {ocupado && <p className={styles.estado}>carregando…</p>}

        <ul className={styles.lista}>
          {produtos.map((p) => (
            <li key={p.id} className={styles.item}>
              <div className={styles.itemFoto}>
                {p.imagem ? <img src={p.imagem} alt="" loading="lazy" /> : <span>—</span>}
              </div>
              <div className={styles.itemInfo}>
                <p className={styles.itemNome}>{p.nome}</p>
                <p className={styles.itemMeta}>
                  {money(p.precoOriginal || p.preco)}
                  {p.estoque !== null && ` · ${p.estoque} em estoque`}
                  {p.sku && ` · ${p.sku}`}
                </p>
              </div>
              {/* Os dois selos ficam num invólucro só: o de estoque é
                  condicional, e sem isso a linha teria ora 4 ora 5 colunas. */}
              <div className={styles.itemTags}>
                {p.estoque !== null && p.estoque > 0 && !p.publicado && (
                  <span className={styles.tagEstoque}>
                    <Package size={11} /> {p.estoque} na prateleira
                  </span>
                )}
                <button
                  type="button"
                  className={p.publicado ? styles.tagOn : styles.tagOff}
                  onClick={() => alternarPublicacao(p)}
                  disabled={alternando === p.id}
                  title={p.publicado ? 'Ocultar da loja' : 'Mostrar na loja'}
                >
                  {alternando === p.id ? (
                    <Loader2 size={12} className={styles.girando} />
                  ) : p.publicado ? (
                    <Eye size={12} />
                  ) : (
                    <EyeOff size={12} />
                  )}
                  {p.publicado ? 'na loja' : 'oculto'}
                </button>
              </div>
              <button className={styles.btnSecundario} onClick={() => abrir(p)} type="button">
                editar
              </button>
            </li>
          ))}
        </ul>

        {!ocupado && !produtos.length && (
          <p className={styles.estado}>Nenhum produto encontrado.</p>
        )}
      </div>
    </main>
  );
}
