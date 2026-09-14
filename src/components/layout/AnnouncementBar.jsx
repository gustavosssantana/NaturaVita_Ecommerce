import styles from './AnnouncementBar.module.css';

const messages = [
  'Frete grátis acima de R$ 199',
  'Compre 3, leve 4 em toda linha Whey',
  'Novos sabores de creatina — confira',
  'Vitamina D3 com 40% off esta semana',
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
