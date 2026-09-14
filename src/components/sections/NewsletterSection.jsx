import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './NewsletterSection.module.css';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.tag}>oferta de boas-vindas</p>
          <h2 className={styles.headline}>
            15% off na 1<sup>a</sup> compra.
          </h2>
          <p className={styles.sub}>+ conteúdo exclusivo sobre nutrição esportiva</p>
        </div>

        <div className={styles.formArea}>
          {submitted ? (
            <p className={styles.successMsg}>
              Cupom enviado! Verifique seu e-mail.
            </p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                className={styles.input}
                placeholder="seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                quero meu cupom <ArrowRight size={15} />
              </button>
            </form>
          )}
          <p className={styles.disclaimer}>sem spam · cancele quando quiser</p>
        </div>
      </div>
    </section>
  );
}
