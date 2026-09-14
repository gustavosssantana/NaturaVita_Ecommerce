import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import styles from './ProfilePage.module.css';
import { useFavorites } from '../context/FavoritesContext';
import {
  User, Package, MapPin, Shield,
  Save, Plus, Edit2, ChevronRight,
  CheckCircle, Truck, Clock, Leaf,
} from 'lucide-react';

const mockUser = {
  name: 'João Costa',
  initials: 'JC',
  email: 'joao.costa@email.com',
  phone: '(11) 99876-5432',
  birthdate: '1992-07-15',
  cpf: '***.***.456-**',
  memberSince: 'Janeiro de 2024',
  stats: { orders: 12, points: 340, favorites: 8 },
};

const mockOrders = [
  {
    id: 'NV-2024-089',
    date: '15/03/2024',
    status: 'delivered',
    statusLabel: 'Entregue',
    items: [{ name: 'Whey Protein Isolado Gold', qty: 1 }],
    total: 'R$ 189,90',
  },
  {
    id: 'NV-2024-076',
    date: '02/03/2024',
    status: 'transit',
    statusLabel: 'A caminho',
    items: [
      { name: 'Creatina Monohidratada', qty: 1 },
      { name: 'BCAA 2:1:1', qty: 1 },
    ],
    total: 'R$ 147,80',
  },
];

const mockAddress = {
  label: 'Casa',
  street: 'Rua das Palmeiras, 847, Apto 12B',
  neighborhood: 'Jardim Europa',
  city: 'São Paulo',
  state: 'SP',
  cep: '01452-000',
  isDefault: true,
};

const TABS = [
  { id: 'dados',      label: 'Dados Pessoais', icon: User },
  { id: 'pedidos',    label: 'Meus Pedidos',   icon: Package },
  { id: 'enderecos',  label: 'Endereços',       icon: MapPin },
  { id: 'seguranca',  label: 'Segurança',       icon: Shield },
];

const STATUS_ICON = { delivered: CheckCircle, transit: Truck, pending: Clock };
const STATUS_CLASS = { delivered: styles.statusDelivered, transit: styles.statusTransit, pending: styles.statusPending };

function StatusBadge({ status, label }) {
  const Icon = STATUS_ICON[status] || Clock;
  return (
    <span className={`${styles.statusBadge} ${STATUS_CLASS[status] || ''}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}

function DadosPessoaisTab() {
  const [form, setForm] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    birthdate: mockUser.birthdate,
    cpf: mockUser.cpf,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value }),),
  });

  return (
    <div className={styles.sectionCard}>
      <h3 className={styles.cardTitle}>Informações Pessoais</h3>
      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Nome completo</label>
            <input className={styles.input} {...field('name')} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input className={styles.input} type="email" {...field('email')} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Telefone</label>
            <input className={styles.input} {...field('phone')} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Data de nascimento</label>
            <input className={styles.input} type="date" {...field('birthdate')} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>CPF</label>
            <input className={`${styles.input} ${styles.inputReadonly}`} value={form.cpf} readOnly />
          </div>
        </div>
        <div className={styles.formFooter}>
          <button type="submit" className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}>
            {saved
              ? <><CheckCircle size={15} /> Salvo com sucesso!</>
              : <><Save size={15} /> Salvar alterações</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function PedidosTab() {
  return (
    <div className={styles.tabContent}>
      {mockOrders.map((order) => (
        <div className={styles.orderCard} key={order.id}>
          <div className={styles.orderHeader}>
            <div className={styles.orderMeta}>
              <span className={styles.orderId}>#{order.id}</span>
              <span className={styles.orderDate}>{order.date}</span>
            </div>
            <StatusBadge status={order.status} label={order.statusLabel} />
          </div>
          <div className={styles.orderItems}>
            {order.items.map((item, i) => (
              <div key={i} className={styles.orderItem}>
                <span className={styles.orderItemDot} />
                {item.name}{item.qty > 1 ? ` × ${item.qty}` : ''}
              </div>
            ))}
          </div>
          <div className={styles.orderFooter}>
            <span className={styles.orderTotal}>{order.total}</span>
            <button className={styles.orderDetailsBtn}>
              Ver detalhes <ChevronRight size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EnderecosTab() {
  return (
    <div className={styles.tabContent}>
      <div className={styles.addressCard}>
        <div className={styles.addressHeader}>
          <div className={styles.addressLabel}>
            <MapPin size={13} />
            {mockAddress.label}
            {mockAddress.isDefault && <span className={styles.defaultBadge}>Principal</span>}
          </div>
          <button className={styles.addressEditBtn}><Edit2 size={14} /></button>
        </div>
        <div className={styles.addressBody}>
          <p>{mockAddress.street}</p>
          <p>{mockAddress.neighborhood} — {mockAddress.city}, {mockAddress.state}</p>
          <p>CEP: {mockAddress.cep}</p>
        </div>
      </div>
      <button className={styles.addAddressBtn}>
        <Plus size={15} />
        Adicionar novo endereço
      </button>
    </div>
  );
}

function SegurancaTab() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className={styles.sectionCard}>
      <h3 className={styles.cardTitle}>Alterar senha</h3>
      <form
        className={styles.form}
        onSubmit={(e) => { e.preventDefault(); alert('Senha alterada com sucesso!'); }}
      >
        <div className={styles.formGrid} style={{ maxWidth: 440 }}>
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Senha atual</label>
            <input className={styles.input} type="password" {...field('current')} />
          </div>
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Nova senha</label>
            <input className={styles.input} type="password" {...field('next')} />
          </div>
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Confirmar nova senha</label>
            <input className={styles.input} type="password" {...field('confirm')} />
          </div>
        </div>
        <div className={styles.formFooter}>
          <button type="submit" className={styles.saveBtn}>
            <Shield size={15} /> Atualizar senha
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('dados');
  const { favoritesCount } = useFavorites();

  return (
    <>
      <Header />
      <main className={styles.page}>

        <div className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{mockUser.initials}</div>
              <div className={styles.avatarBadge}><Leaf size={12} /></div>
            </div>
            <div className={styles.heroText}>
              <h1 className={styles.heroName}>{mockUser.name}</h1>
              <p className={styles.heroSince}>Membro desde {mockUser.memberSince}</p>
            </div>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{mockUser.stats.orders}</span>
                <span className={styles.statLabel}>Pedidos</span>
              </div>
              <div className={styles.statSep} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>{mockUser.stats.points}</span>
                <span className={styles.statLabel}>Pontos</span>
              </div>
              <div className={styles.statSep} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>{favoritesCount}</span>
                <span className={styles.statLabel}>Favoritos</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tabBar}>
          <div className="container">
            <div className={styles.tabList}>
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`container ${styles.content}`}>
          {activeTab === 'dados'     && <DadosPessoaisTab />}
          {activeTab === 'pedidos'   && <PedidosTab />}
          {activeTab === 'enderecos' && <EnderecosTab />}
          {activeTab === 'seguranca' && <SegurancaTab />}
        </div>

      </main>
      <Footer />
    </>
  );
}
