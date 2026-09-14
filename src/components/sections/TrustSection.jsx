import { Truck, ShieldCheck, RefreshCw, CreditCard, ArrowRight } from 'lucide-react';
import Link from '../ui/Link';
import styles from './TrustSection.module.css';

const ITEMS = [
  {
    icon: Truck,
    title: 'Frete grátis acima de R$199',
    text: 'Enviamos para todo o Brasil com rastreio.',
  },
  {
    icon: ShieldCheck,
    title: 'Produtos lacrados',
    text: 'Procedência conferida item a item.',
  },
  {
    icon: RefreshCw,
    title: 'Troca em até 7 dias',
    text: 'Direito de arrependimento garantido por lei.',
  },
  {
    icon: CreditCard,
    title: 'Pagamento seguro',
    text: 'Pix, boleto ou cartão em até 6x sem juros.',
  },
];

export default function TrustSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className={styles.item}>
              <span className={styles.iconWrap}>
                <Icon size={18} strokeWidth={1.9} />
              </span>
              <div className={styles.itemText}>
                <p className={styles.itemTitle}>{title}</p>
                <p className={styles.itemDesc}>{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>
              Tudo que você precisa, <em>em um lugar só.</em>
            </h2>
            <p className={styles.ctaDesc}>
              Suplementos, vitaminas, granel, chás e naturais — com preço de loja e entrega rápida.
            </p>
          </div>
          <Link href="/loja" className={styles.ctaBtn}>
            Ver catálogo completo <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
