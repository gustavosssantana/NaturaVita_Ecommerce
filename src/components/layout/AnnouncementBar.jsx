import styles from './AnnouncementBar.module.css';

// Only claims the store can actually keep — no invented promotions.
const messages = [
  'Frete grátis acima de R$ 199',
  'Envio em até 24h úteis',
  'Pague com Pix, boleto ou cartão',
  'Entrega para todo o Brasil',
  'Produtos lacrados e com procedência',
];

export default function AnnouncementBar() {
  const track = [...messages, ...messages];
  return (
    <div className={styles.bar}>
      <div className={styles.fadeLeft} />
      <div className={styles.track}>
        {track.map((msg, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.dot}>✦</span>
            {msg}
          </span>
        ))}
      </div>
      <div className={styles.fadeRight} />
    </div>
  );
}
