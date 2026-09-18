import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Lock, Search, Plus, ArrowLeft, Camera, Loader2, Check, AlertCircle, Eye, EyeOff,
  Package, Image as ImageIcon, Boxes, Trash2, ChevronUp, ChevronDown, Link2, LogOut,
  Leaf, LayoutGrid,
} from 'lucide-react';
import { money } from '../lib/format';
import styles from './AdminPage.module.css';

const CHAVE = 'naturavita:admin';
const VAZIO = {
  nome: '', descricao: '', preco: '', estoque: '', sku: '',
  categorias: [], publicado: true, foto: null, fotoNome: '',
};

/**
 * Painel do lojista: produtos e banners da home, direto na Nuvemshop.
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

  const [secao, setSecao] = useState('produtos'); // produtos | banners | categorias

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

  function sair() {
    try { sessionStorage.removeItem(CHAVE); } catch { /* ignora */ }
    setSenha('');
    setDentro(false);
    setProdutos([]);
    setEditando(null);
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
          <span className={styles.loginMarca}>
            <Leaf size={17} strokeWidth={2.3} />
          </span>
          <h1 className={styles.loginTitulo}>Painel Natura Vita</h1>
          <p className={styles.loginSub}>Acesso restrito ao lojista.</p>
          <div className={styles.loginCampo}>
            <Lock size={16} />
            <input
              type="password" value={senha} onChange={(ev) => setSenha(ev.target.value)}
              placeholder="senha" autoComplete="current-password" disabled={ocupado}
            />
          </div>
          {erro && <p className={styles.erro} role="alert"><AlertCircle size={14} /> {erro}</p>}
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
        <BarraTopo secao={secao} setSecao={() => {}} sair={sair} compacto />
        <div className={styles.container}>
          <button className={styles.voltar} onClick={() => setEditando(null)} type="button">
            <ArrowLeft size={15} /> voltar para a lista
          </button>
          <h1 className={styles.titulo}>{novo ? 'Novo produto' : 'Editar produto'}</h1>
          <p className={styles.subtitulo}>
            {novo
              ? 'Tire a foto, preencha e envie. Ele aparece na loja em seguida.'
              : 'O que você mudar aqui vale na loja assim que salvar.'}
          </p>

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
              <div className={styles.fotoLado}>
                <button
                  type="button" className={styles.btnFoto}
                  onClick={() => arquivoRef.current?.click()} disabled={ocupado}
                >
                  <Camera size={16} /> {form.foto ? 'trocar foto' : 'tirar ou escolher foto'}
                </button>
                {/* capture abre a câmera direto no celular */}
                <input
                  ref={arquivoRef} type="file" accept="image/jpeg,image/png,image/webp"
                  capture="environment" onChange={escolherFoto} hidden
                />
                <p className={styles.dica}>
                  Fundo claro e o produto inteiro na foto. Formato quadrado fica melhor na vitrine.
                </p>
                {!novo && form.foto && (
                  <p className={styles.dicaForte}>A foto atual será substituída ao salvar.</p>
                )}
              </div>
            </div>

            <label className={styles.campo}>
              <span>Nome</span>
              <input
                className={styles.input} value={form.nome} disabled={ocupado}
                placeholder="Ex.: Whey Protein Concentrado 900g Baunilha"
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
                  className={styles.input} type="number" step="0.01" min="0" inputMode="decimal"
                  value={form.preco} disabled={ocupado}
                  onChange={(ev) => setForm((s) => ({ ...s, preco: ev.target.value }))}
                />
              </label>
              <label className={styles.campo}>
                <span>Estoque</span>
                <input
                  className={styles.input} type="number" step="1" min="0" inputMode="numeric"
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

            <div className={styles.barraSalvar}>
              <button type="submit" className={styles.btnPrincipal} disabled={ocupado}>
                {ocupado ? (
                  <><Loader2 size={16} className={styles.girando} /> salvando…</>
                ) : novo ? 'criar produto' : 'salvar alterações'}
              </button>
              <button
                type="button" className={styles.btnSecundario}
                onClick={() => setEditando(null)} disabled={ocupado}
              >
                cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  // ── banners ───────────────────────────────────────────────────────────────
  if (secao === 'banners') {
    return (
      <main className={styles.wrap}>
        <BarraTopo secao={secao} setSecao={setSecao} sair={sair} />
        <div className={styles.container}>
          <PainelBanners chamar={chamar} />
        </div>
      </main>
    );
  }

  // ── artes das categorias ──────────────────────────────────────────────────
  if (secao === 'categorias') {
    return (
      <main className={styles.wrap}>
        <BarraTopo secao={secao} setSecao={setSecao} sair={sair} />
        <div className={styles.container}>
          <PainelCategorias chamar={chamar} />
        </div>
      </main>
    );
  }

  // ── lista ─────────────────────────────────────────────────────────────────
  return (
    <main className={styles.wrap}>
      <BarraTopo secao={secao} setSecao={setSecao} sair={sair} />
      <div className={styles.container}>
        <div className={styles.topo}>
          <div>
            <h1 className={styles.titulo}>Produtos</h1>
            <p className={styles.subtitulo}>
              {totais ? `${totais.loja} na loja · ${totais.ocultos} ocultos` : 'carregando…'}
            </p>
          </div>
          <button className={styles.btnPrincipal} onClick={() => abrir('novo')} type="button">
            <Plus size={17} /> novo produto
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
            <Package size={15} />
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
          <Search size={16} />
          <input
            className={styles.buscaInput} value={busca} placeholder="buscar por nome ou código"
            onChange={(ev) => setBusca(ev.target.value)}
          />
          <button type="submit" className={styles.btnSecundario} disabled={ocupado}>buscar</button>
        </form>

        {ocupado && (
          <ul className={styles.lista}>
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className={`${styles.item} ${styles.fantasma}`} aria-hidden="true">
                <div className={styles.itemFoto} />
                <div className={styles.itemInfo}>
                  <span className={styles.barraFalsa} />
                  <span className={`${styles.barraFalsa} ${styles.barraCurta}`} />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!ocupado && (
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
        )}

        {!ocupado && !produtos.length && (
          <p className={styles.vazio}>
            <Boxes size={26} />
            Nenhum produto encontrado com esse filtro.
          </p>
        )}
      </div>
    </main>
  );
}

/** Barra fixa do painel: onde estou, para onde vou, e como sair. */
function BarraTopo({ secao, setSecao, sair, compacto = false }) {
  return (
    <header className={styles.barra}>
      <div className={styles.barraInterna}>
        <span className={styles.barraMarca}>
          <Leaf size={15} strokeWidth={2.4} />
          <span>Natura Vita</span>
        </span>

        {!compacto && (
          <nav className={styles.barraNav}>
            <button
              type="button"
              className={`${styles.barraLink} ${secao === 'produtos' ? styles.barraLinkOn : ''}`}
              onClick={() => setSecao('produtos')}
            >
              <Boxes size={15} /> Produtos
            </button>
            <button
              type="button"
              className={`${styles.barraLink} ${secao === 'banners' ? styles.barraLinkOn : ''}`}
              onClick={() => setSecao('banners')}
            >
              <ImageIcon size={15} /> Banners
            </button>
            <button
              type="button"
              className={`${styles.barraLink} ${secao === 'categorias' ? styles.barraLinkOn : ''}`}
              onClick={() => setSecao('categorias')}
            >
              <LayoutGrid size={15} /> Categorias
            </button>
          </nav>
        )}

        <button type="button" className={styles.barraSair} onClick={sair} title="Sair do painel">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

/**
 * Banners da home. São as imagens de promoção que giram no topo da loja.
 * O máximo é 8 — mais que isso e o visitante nunca chega a ver o último.
 */
function PainelBanners({ chamar }) {
  const [banners, setBanners] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [links, setLinks] = useState({});
  const entradaRef = useRef(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const r = await chamar('banners');
      setBanners(r.banners || []);
      setLinks(Object.fromEntries((r.banners || []).map((b) => [b.id, b.link || ''])));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [chamar]);

  useEffect(() => { recarregar(); }, [recarregar]);

  function aplicar(r) {
    setBanners(r.banners || []);
    setLinks(Object.fromEntries((r.banners || []).map((b) => [b.id, b.link || ''])));
  }

  async function subir(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 9 * 1024 * 1024) {
      setErro('A imagem é grande demais (máximo 9 MB).');
      return;
    }
    setErro(null);
    setAviso(null);
    const leitor = new FileReader();
    leitor.onload = async () => {
      setOcupado(true);
      try {
        aplicar(await chamar('banner_adicionar', { foto: leitor.result, fotoNome: f.name }));
        setAviso('Banner publicado. Ele aparece na home em até um minuto.');
      } catch (err) {
        setErro(err.message);
      } finally {
        setOcupado(false);
      }
    };
    leitor.readAsDataURL(f);
  }

  async function operar(acao, dados, mensagem) {
    setOcupado(true);
    setErro(null);
    setAviso(null);
    try {
      aplicar(await chamar(acao, dados));
      if (mensagem) setAviso(mensagem);
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h1 className={styles.titulo}>Banners da home</h1>
          <p className={styles.subtitulo}>
            As imagens de promoção que giram no topo da loja. {banners.length} de 8.
          </p>
        </div>
        <button
          type="button" className={styles.btnPrincipal}
          onClick={() => entradaRef.current?.click()}
          disabled={ocupado || banners.length >= 8}
        >
          {ocupado ? <Loader2 size={16} className={styles.girando} /> : <Plus size={17} />}
          subir imagem
        </button>
        <input
          ref={entradaRef} type="file" accept="image/jpeg,image/png,image/webp"
          onChange={subir} hidden
        />
      </div>

      {aviso && <p className={styles.ok}><Check size={14} /> {aviso}</p>}
      {erro && <p className={styles.erro} role="alert"><AlertCircle size={14} /> {erro}</p>}

      <p className={styles.destaque}>
        <ImageIcon size={15} />
        <span>
          Use imagens deitadas de <strong>1600 × 600 pixels</strong>. No computador ela
          aparece inteira; no celular as laterais são cortadas, então deixe o texto e o
          produto no <strong>miolo da arte</strong>.
        </span>
      </p>

      {carregando && <p className={styles.estado}>carregando…</p>}

      {!carregando && !banners.length && (
        <p className={styles.vazio}>
          <ImageIcon size={26} />
          Nenhum banner ainda. Enquanto não houver, a home mostra uma capa com o nome da loja.
        </p>
      )}

      <ul className={styles.bannerLista}>
        {banners.map((b, i) => (
          <li key={b.id} className={styles.bannerItem}>
            <span className={styles.bannerOrdem}>{i + 1}º</span>
            <img src={b.src} alt="" className={styles.bannerFoto} />

            <div className={styles.bannerAcoes}>
              <label className={styles.bannerLink}>
                <Link2 size={14} />
                <input
                  value={links[b.id] ?? ''}
                  placeholder="para onde leva ao clicar (ex.: /vitaminas)"
                  onChange={(ev) => setLinks((s) => ({ ...s, [b.id]: ev.target.value }))}
                  disabled={ocupado}
                />
                {(links[b.id] ?? '') !== (b.link || '') && (
                  <button
                    type="button" className={styles.bannerSalvar}
                    onClick={() => operar('banner_link', { imagemId: b.id, link: links[b.id] }, 'Link salvo.')}
                    disabled={ocupado}
                  >
                    salvar
                  </button>
                )}
              </label>

              <div className={styles.bannerBotoes}>
                <button
                  type="button" className={styles.bannerIcone} title="Subir na ordem"
                  disabled={ocupado || i === 0}
                  onClick={() => operar('banner_mover', { imagemId: b.id, direcao: 'cima' })}
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button" className={styles.bannerIcone} title="Descer na ordem"
                  disabled={ocupado || i === banners.length - 1}
                  onClick={() => operar('banner_mover', { imagemId: b.id, direcao: 'baixo' })}
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  type="button" className={`${styles.bannerIcone} ${styles.bannerRemover}`}
                  title="Remover banner" disabled={ocupado}
                  onClick={() => operar('banner_remover', { imagemId: b.id }, 'Banner removido.')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Artes das categorias — os quadradinhos de "Comprar por categoria" na home.
 *
 * Sem arte própria, a home usa a foto do primeiro produto da categoria que
 * tiver imagem. Funciona, mas é aleatório: uma categoria inteira acaba
 * representada por um pote qualquer.
 */
function PainelCategorias({ chamar }) {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(null); // slug em processamento
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);
  const entradas = useRef({});

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const r = await chamar('categorias');
      setLista(r.categorias || []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [chamar]);

  useEffect(() => { recarregar(); }, [recarregar]);

  function escolher(slug, e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 9 * 1024 * 1024) {
      setErro('A imagem é grande demais (máximo 9 MB).');
      return;
    }
    setErro(null);
    setAviso(null);
    const leitor = new FileReader();
    leitor.onload = async () => {
      setOcupado(slug);
      try {
        const r = await chamar('categoria_imagem', { slug, foto: leitor.result });
        setLista((atual) => atual.map((c) => (c.slug === slug ? { ...c, imagem: r.imagem } : c)));
        setAviso('Arte salva. A home atualiza em até 10 minutos.');
      } catch (err) {
        setErro(err.message);
      } finally {
        setOcupado(null);
      }
    };
    leitor.readAsDataURL(f);
  }

  async function remover(slug) {
    setOcupado(slug);
    setErro(null);
    setAviso(null);
    try {
      await chamar('categoria_imagem_remover', { slug });
      setLista((atual) => atual.map((c) => (c.slug === slug ? { ...c, imagem: null } : c)));
      setAviso('Arte removida. A categoria volta a usar a foto de um produto.');
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado(null);
    }
  }

  return (
    <>
      <div className={styles.topo}>
        <div>
          <h1 className={styles.titulo}>Artes das categorias</h1>
          <p className={styles.subtitulo}>
            A imagem de cada categoria na home. {lista.filter((c) => c.imagem).length} de{' '}
            {lista.length} com arte própria.
          </p>
        </div>
      </div>

      {aviso && <p className={styles.ok}><Check size={14} /> {aviso}</p>}
      {erro && <p className={styles.erro} role="alert"><AlertCircle size={14} /> {erro}</p>}

      <p className={styles.destaque}>
        <LayoutGrid size={15} />
        <span>
          Imagens <strong>quadradas, 800 × 800</strong>, fundo claro e uniforme. A home
          mostra dentro de um <strong>círculo</strong>, então deixe o produto no meio — os
          cantos são cortados. Sem arte, a categoria usa a foto de um produto qualquer dela.
        </span>
      </p>

      {carregando && <p className={styles.estado}>carregando…</p>}

      <ul className={styles.catLista}>
        {lista.map((c) => (
          <li key={c.id} className={styles.catItem}>
            <div className={styles.catFoto}>
              {c.imagem ? <img src={c.imagem} alt="" loading="lazy" /> : <ImageIcon size={20} />}
            </div>
            <div className={styles.catInfo}>
              <p className={styles.catNome}>{c.nome}</p>
              <p className={styles.catEstado}>
                {c.imagem ? 'arte própria' : 'usando foto de produto'}
              </p>
            </div>
            <div className={styles.catAcoes}>
              <button
                type="button" className={styles.btnSecundario}
                onClick={() => entradas.current[c.slug]?.click()}
                disabled={ocupado === c.slug}
              >
                {ocupado === c.slug ? (
                  <Loader2 size={14} className={styles.girando} />
                ) : (
                  <Camera size={14} />
                )}
                {c.imagem ? 'trocar' : 'subir'}
              </button>
              {c.imagem && (
                <button
                  type="button" className={`${styles.bannerIcone} ${styles.bannerRemover}`}
                  onClick={() => remover(c.slug)} disabled={ocupado === c.slug}
                  title="Remover arte"
                >
                  <Trash2 size={15} />
                </button>
              )}
              <input
                ref={(el) => { entradas.current[c.slug] = el; }}
                type="file" accept="image/jpeg,image/png,image/webp"
                onChange={(e) => escolher(c.slug, e)} hidden
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
