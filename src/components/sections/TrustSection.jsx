import { ShieldCheck, Truck, CreditCard, MessageCircle } from 'lucide-react';
import styles from './TrustSection.module.css';

/**
 * Só promessas que a loja consegue cumprir hoje. Nada de "frete grátis acima
 * de X" enquanto o frete ainda é calculado no fechamento do pedido — promessa
 * que o checkout não confirma vira reclamação.
 */
const ITENS = [
  {
    icone: ShieldCheck,
    titulo: 'Produto lacrado e original',
    texto: 'Marcas conhecidas, com procedência e validade conferidas antes do envio.',
  },
  {
    icone: CreditCard,
    titulo: 'Pagamento seguro',
    texto: 'Pix, boleto ou cartão. O pagamento acontece no ambiente protegido da loja.',
  },
  {
    icone: Truck,
    titulo: 'Entrega para todo o Brasil',
    texto: 'O valor e o prazo aparecem no fechamento do pedido, pelo seu CEP.',
  },
  {
    icone: MessageCircle,
    titulo: 'Atendimento direto',
    texto: 'Dúvida sobre um produto? Você fala com quem separa o pedido.',
  },
];

export default function TrustSection() {
  return (
    <section className={`section ${styles.sec}`}>
      <div className="container">
        <div className={styles.grade}>
          {ITENS.map(({ icone: Icone, titulo, texto }) => (
            <div key={titulo} className={styles.item}>
              <span className={styles.icone}>
                <Icone size={19} strokeWidth={1.9} />
              </span>
              <div>
                <p className={styles.titulo}>{titulo}</p>
                <p className={styles.texto}>{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
