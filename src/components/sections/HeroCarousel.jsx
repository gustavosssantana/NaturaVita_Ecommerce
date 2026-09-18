import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from '../ui/Link';
import { useCatalog } from '../../data/CatalogContext';
import styles from './HeroCarousel.module.css';

const INTERVALO = 6000;

/**
 * Faixa de banners da home — as imagens de promoção que o lojista sobe pelo
 * painel. Gira sozinha, para quando o dedo encosta e volta a girar depois.
 *
 * Sem banner nenhum cadastrado ela não fica vazia: mostra uma capa montada
 * com o próprio catálogo, para a home nunca abrir com um buraco.
 */
export default function HeroCarousel() {
  const { products, categories } = useCatalog();
  const [banners, setBanners] = useState([]);
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);
  const toqueX = useRef(null);

  useEffect(() => {
    let vivo = true;
    fetch('/api/banners')
      .then((r) => (r.ok ? r.json() : { banners: [] }))
      .then((d) => {
        if (vivo && Array.isArray(d.banners)) setBanners(d.banners);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  const total = banners.length;

  useEffect(() => {
    if (pausado || total < 2) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % total), INTERVALO);
    return () => clearInterval(t);
  }, [pausado, total]);

  // Se um banner for removido enquanto a página está aberta, o índice
  // guardado pode apontar para fora da lista.
  useEffect(() => {
    if (i >= total) setI(0);
  }, [i, total]);

  function inicioToque(e) {
    toqueX.current = e.touches[0].clientX;
    setPausado(true);
  }
  function fimToque(e) {
    const inicio = toqueX.current;
    toqueX.current = null;
    setPausado(false);
    if (inicio == null || total < 2) return;
    const d = e.changedTouches[0].clientX - inicio;
    if (Math.abs(d) < 45) return;
    setI((v) => (d < 0 ? (v + 1) % total : (v - 1 + total) % total));
  }

  if (!total) return <CapaPadrao products={products} categories={categories} />;

  return (
    <section className={styles.wrap} aria-label="Promoções">
      <div className="container">
        <div
          className={styles.palco}
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onTouchStart={inicioToque}
          onTouchEnd={fimToque}
        >
          <div className={styles.trilho} style={{ transform: `translateX(-${i * 100}%)` }}>
            {banners.map((b, idx) => {
              const conteudo = (
                <img
                  src={b.src}
                  alt={b.alt || `Promoção ${idx + 1}`}
                  className={styles.img}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  draggable="false"
                />
              );
              return b.link ? (
                <Link key={b.id} href={b.link} className={styles.slide}>
                  {conteudo}
                </Link>
              ) : (
                <div key={b.id} className={styles.slide}>
                  {conteudo}
                </div>
              );
            })}
          </div>

          {total > 1 && (
            <>
              <button
                className={`${styles.seta} ${styles.setaEsq}`}
                onClick={() => setI((v) => (v - 1 + total) % total)}
                aria-label="Banner anterior"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className={`${styles.seta} ${styles.setaDir}`}
                onClick={() => setI((v) => (v + 1) % total)}
                aria-label="Próximo banner"
              >
                <ChevronRight size={22} />
              </button>

              <div className={styles.pontos}>
                {banners.map((b, idx) => (
                  <button
                    key={b.id}
                    className={`${styles.ponto} ${idx === i ? styles.pontoOn : ''}`}
                    onClick={() => setI(idx)}
                    aria-label={`Ir para o banner ${idx + 1}`}
                    aria-current={idx === i}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Capa usada enquanto não há banner cadastrado.
 *
 * Enxuta de propósito: uma linha e um botão. A versão anterior tinha selo,
 * título em duas partes e um parágrafo de apoio — texto demais para o que é,
 * no fim das contas, um espaço reservado até o lojista subir a arte dele.
 */
function CapaPadrao() {
  return (
    <section className={styles.wrap} aria-label="Boas-vindas">
      <div className="container">
        <div className={styles.capa}>
          <div className={styles.capaTexto}>
            <h1 className={styles.capaTitulo}>
              Nutrição de verdade, <em>sem concessões.</em>
            </h1>
            <Link href="/loja" className={`btn btn-accent ${styles.capaBtn}`}>
              Ver todos os produtos <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.capaFolhas} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
