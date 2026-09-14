import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import styles from './SettingsPage.module.css';
import {
  Bell, Shield, Palette, SlidersHorizontal, UserX,
  Mail, Smartphone, Eye, BarChart2, Globe,
  DollarSign, Ruler, Download, Trash2, ChevronRight,
  AlertTriangle, CheckCircle,
} from 'lucide-react';

/* ── Toggle ── */
function Toggle({ id, checked, onChange }) {
  return (
    <label className={styles.toggle} htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <span className={styles.toggleSlider} />
    </label>
  );
}

/* ── Setting row ── */
function SettingRow({ icon: Icon, title, description, control }) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingIcon}><Icon size={16} /></div>
      <div className={styles.settingText}>
        <span className={styles.settingTitle}>{title}</span>
        {description && <span className={styles.settingDesc}>{description}</span>}
      </div>
      <div className={styles.settingControl}>{control}</div>
    </div>
  );
}

/* ── Section card ── */
function SectionCard({ title, children }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
}

/* ── Nav sections ── */
const NAV = [
  { id: 'notificacoes', label: 'Notificações',  icon: Bell },
  { id: 'privacidade',  label: 'Privacidade',   icon: Shield },
  { id: 'aparencia',    label: 'Aparência',      icon: Palette },
  { id: 'preferencias', label: 'Preferências',   icon: SlidersHorizontal },
  { id: 'conta',        label: 'Conta',          icon: UserX },
];

/* ── Sections ── */
function Notificacoes({ state, set }) {
  const tog = (key) => <Toggle id={key} checked={state[key]} onChange={() => set(key)} />;
  return (
    <>
      <SectionCard title="E-mail">
        <SettingRow icon={Mail} title="Promoções e ofertas"       description="Descontos exclusivos e cupons personalizados"      control={tog('emailPromos')} />
        <SettingRow icon={Mail} title="Lançamentos e novidades"   description="Novos produtos e coleções em primeira mão"         control={tog('emailNews')} />
        <SettingRow icon={Mail} title="Atualizações de pedidos"   description="Confirmações, envio e entrega dos seus pedidos"    control={tog('emailOrders')} />
        <SettingRow icon={Mail} title="Newsletter semanal"        description="Dicas de nutrição, treino e bem-estar"             control={tog('emailNewsletter')} />
      </SectionCard>
      <SectionCard title="Push (navegador)">
        <SettingRow icon={Smartphone} title="Promoções relâmpago"        description="Ofertas com tempo limitado e flash sales"     control={tog('pushPromos')} />
        <SettingRow icon={Smartphone} title="Lembrete de carrinho"       description="Você deixou produtos sem finalizar a compra" control={tog('pushCart')} />
      </SectionCard>
    </>
  );
}

function Privacidade({ state, set }) {
  const tog = (key) => <Toggle id={key} checked={state[key]} onChange={() => set(key)} />;
  return (
    <SectionCard title="Controle de dados">
      <SettingRow icon={Eye}      title="Personalização"          description="Usamos seu histórico para recomendar produtos relevantes" control={tog('privPersonal')} />
      <SettingRow icon={BarChart2} title="Cookies analíticos"     description="Ajudam a melhorar nossa plataforma com dados de uso"      control={tog('privAnalytics')} />
      <SettingRow icon={Globe}    title="Parceiros de publicidade" description="Compartilhar dados para anúncios em outros sites"         control={tog('privPartners')} />
      <SettingRow icon={Eye}      title="Histórico de navegação"  description="Salvamos produtos visualizados para facilitar o retorno"  control={tog('privHistory')} />
    </SectionCard>
  );
}

function Aparencia({ state, set }) {
  const tog = (key) => <Toggle id={key} checked={state[key]} onChange={() => set(key)} />;
  return (
    <SectionCard title="Exibição">
      <SettingRow
        icon={Palette}
        title="Destaque de economia"
        description="Mostra o valor economizado em comparação ao preço original"
        control={tog('showSavings')}
      />
      <SettingRow
        icon={BarChart2}
        title="Avaliações nos cards"
        description="Exibe estrelas e número de avaliações nos cards de produto"
        control={tog('showRatings')}
      />
      <SettingRow
        icon={Eye}
        title="Produtos sem estoque"
        description="Exibe produtos esgotados com opção de aviso por e-mail"
        control={tog('showOutOfStock')}
      />
    </SectionCard>
  );
}

function Preferencias({ state, setVal }) {
  const sel = (key, opts) => (
    <select
      className={styles.select}
      value={state[key]}
      onChange={(e) => setVal(key, e.target.value)}
    >
      {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <SectionCard title="Localização e unidades">
      <SettingRow
        icon={Globe}
        title="Idioma"
        description="Idioma da interface e comunicações"
        control={sel('language', [
          { value: 'pt-BR', label: 'Português (Brasil)' },
          { value: 'en',    label: 'English' },
          { value: 'es',    label: 'Español' },
        ])}
      />
      <SettingRow
        icon={DollarSign}
        title="Moeda"
        description="Moeda para exibição de preços"
        control={sel('currency', [
          { value: 'BRL', label: 'Real (R$)' },
          { value: 'USD', label: 'Dólar (US$)' },
          { value: 'EUR', label: 'Euro (€)' },
        ])}
      />
      <SettingRow
        icon={Ruler}
        title="Unidade de peso"
        description="Preferência para exibição de quantidades"
        control={sel('unit', [
          { value: 'g',  label: 'Gramas (g)' },
          { value: 'kg', label: 'Quilogramas (kg)' },
          { value: 'oz', label: 'Onças (oz)' },
        ])}
      />
    </SectionCard>
  );
}

function Conta() {
  const [exported, setExported] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <>
      <SectionCard title="Seus dados">
        <div className={styles.accountRow}>
          <div className={styles.accountRowText}>
            <Download size={16} className={styles.accountRowIcon} />
            <div>
              <p className={styles.settingTitle}>Exportar meus dados</p>
              <p className={styles.settingDesc}>Baixe uma cópia de todos os dados associados à sua conta (pedidos, favoritos, perfil)</p>
            </div>
          </div>
          <button className={`${styles.exportBtn} ${exported ? styles.exportBtnDone : ''}`} onClick={handleExport}>
            {exported ? <><CheckCircle size={14} /> Exportado!</> : <><Download size={14} /> Exportar</>}
          </button>
        </div>
      </SectionCard>

      <div className={styles.dangerZone}>
        <div className={styles.dangerHeader}>
          <AlertTriangle size={15} />
          Zona de perigo
        </div>
        <div className={styles.dangerBody}>
          <div className={styles.dangerText}>
            <p className={styles.dangerTitle}>Excluir conta</p>
            <p className={styles.dangerDesc}>
              Esta ação é permanente e irreversível. Todos os seus dados, pedidos, favoritos e histórico serão apagados.
            </p>
          </div>
          {!showConfirm ? (
            <button className={styles.deleteBtn} onClick={() => setShowConfirm(true)}>
              <Trash2 size={14} /> Excluir conta
            </button>
          ) : (
            <div className={styles.confirmBox}>
              <p className={styles.confirmText}>Tem certeza? Esta ação não pode ser desfeita.</p>
              <div className={styles.confirmActions}>
                <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)}>Cancelar</button>
                <button className={styles.confirmDeleteBtn} onClick={() => alert('Conta excluída (mock)')}>
                  Sim, excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Main page ── */
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('notificacoes');
  const [saved, setSaved] = useState(false);

  const [toggles, setToggles] = useState({
    emailPromos: true,
    emailNews: true,
    emailOrders: true,
    emailNewsletter: false,
    pushPromos: false,
    pushCart: true,
    privPersonal: true,
    privAnalytics: true,
    privPartners: false,
    privHistory: true,
    showSavings: true,
    showRatings: true,
    showOutOfStock: false,
  });

  const [prefs, setPrefs] = useState({
    language: 'pt-BR',
    currency: 'BRL',
    unit: 'g',
  });

  const toggleKey = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));
  const setPref = (key, val) => setPrefs((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const renderSection = () => {
    if (activeSection === 'notificacoes') return <Notificacoes state={toggles} set={toggleKey} />;
    if (activeSection === 'privacidade')  return <Privacidade  state={toggles} set={toggleKey} />;
    if (activeSection === 'aparencia')   return <Aparencia    state={toggles} set={toggleKey} />;
    if (activeSection === 'preferencias') return <Preferencias state={prefs}   setVal={setPref} />;
    if (activeSection === 'conta')       return <Conta />;
    return null;
  };

  const activeNav = NAV.find((n) => n.id === activeSection);

  return (
    <>
      <Header />
      <main className={styles.page}>

        <div className={styles.pageHeader}>
          <div className={`container ${styles.pageHeaderInner}`}>
            <div>
              <p className={styles.pageLabel}>Minha conta</p>
              <h1 className={styles.pageTitle}>Configurações</h1>
            </div>
          </div>
        </div>

        <div className={`container ${styles.layout}`}>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              {NAV.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`${styles.navItem} ${activeSection === id ? styles.navItemActive : ''}`}
                  onClick={() => setActiveSection(id)}
                >
                  <Icon size={16} className={styles.navIcon} />
                  {label}
                  <ChevronRight size={14} className={styles.navChevron} />
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              <div className={styles.contentHeaderLeft}>
                {activeNav && <activeNav.icon size={18} className={styles.contentHeaderIcon} />}
                <h2 className={styles.contentTitle}>{activeNav?.label}</h2>
              </div>
              {activeSection !== 'conta' && (
                <button
                  className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}
                  onClick={handleSave}
                >
                  {saved ? <><CheckCircle size={14} /> Salvo!</> : 'Salvar alterações'}
                </button>
              )}
            </div>

            <div className={styles.sections}>
              {renderSection()}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
