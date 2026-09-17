import styles from './AnnouncementBar.module.css';

// Só o que a loja cumpre hoje. As linhas sobre frete grátis e prazo de 24h
// saíram daqui: o frete ainda é calculado no fechamento do pedido, e prometer
// prazo que o checkout não confirma vira reclamação depois.
const messages = [
  'Entrega para todo o Brasil',
  'Pague com Pix, boleto ou cartão',
  'Produtos lacrados e com procedência',
  'Frete calculado pelo seu CEP no fechamento',
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
