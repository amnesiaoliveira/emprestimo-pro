"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
type Modal = "client" | "loan" | "clients" | "loans" | "payments" | "reports" | "help" | "profile" | null;
type Client = { name: string; phone: string; cpf: string; initials: string };

const initialClients: Client[] = [
  { name: "Mariana Souza", phone: "(11) 98842-1010", cpf: "***.542.***-**", initials: "MS" },
  { name: "Roberto Lima", phone: "(11) 97731-2098", cpf: "***.817.***-**", initials: "RL" },
  { name: "Camila Rocha", phone: "(11) 96550-4432", cpf: "***.109.***-**", initials: "CR" },
];

const loans = [
  { name: "Mariana Souza", initials: "MS", value: 5000, parcel: 620.42, status: "Em dia", tone: "green", due: "12 ago" },
  { name: "Roberto Lima", initials: "RL", value: 2800, parcel: 516.18, status: "Vence hoje", tone: "amber", due: "Hoje" },
  { name: "Camila Rocha", initials: "CR", value: 8500, parcel: 997.64, status: "Atrasado", tone: "red", due: "03 ago" },
];

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [modal, setModal] = useState<Modal>(null);
  const [clients, setClients] = useState(initialClients);
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(10);
  const [frequencyDays, setFrequencyDays] = useState(30);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("credfacil-theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("credfacil-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const calc = useMemo(() => {
    const monthlyRate = rate / 100;
    const r = Math.pow(1 + monthlyRate, frequencyDays / 30) - 1;
    const installment = r === 0 ? amount / months : amount * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = installment * months;
    const firstDue = new Date();
    firstDue.setDate(firstDue.getDate() + frequencyDays);
    const finalDue = new Date();
    finalDue.setDate(finalDue.getDate() + frequencyDays * months);
    return { installment, total, interest: total - amount, firstDue, finalDue };
  }, [amount, rate, months, frequencyDays]);

  function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const cpf = String(form.get("cpf") || "").trim();
    if (!name || !phone) return;
    const initials = name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    setClients((current) => [{ name, phone, cpf: cpf || "Não informado", initials }, ...current]);
    setModal(null);
    setToast("Cliente cadastrado com sucesso");
  }

  const nav = [
    { key: null, icon: "⌂", label: "Início" },
    { key: "clients" as Modal, icon: "♙", label: "Clientes" },
    { key: "loans" as Modal, icon: "▤", label: "Empréstimos" },
    { key: "payments" as Modal, icon: "◷", label: "Parcelas" },
    { key: "reports" as Modal, icon: "▥", label: "Relatórios" },
  ];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">$</span><span>CredFácil</span></div>
        <nav>{nav.map((item) => <button key={item.label} className={!item.key ? "active" : ""} onClick={() => setModal(item.key)}><span>{item.icon}</span>{item.label}</button>)}</nav>
        <div className="sidebar-bottom">
          <button onClick={() => setModal("help")}><span>?</span>Ajuda e suporte</button>
          <button className="profile" onClick={() => setModal("profile")}><span className="avatar">JS</span><span><strong>João Silva</strong><small>Administrador</small></span><b>›</b></button>
        </div>
      </aside>

      <section className="content">
        <header>
          <div><p className="eyebrow">VISÃO GERAL</p><h1>Olá, João! <span>👋</span></h1><p>Acompanhe sua carteira de empréstimos.</p></div>
          <div className="header-actions">
            <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Alternar tema"><span>{theme === "light" ? "☾" : "☀"}</span><b>{theme === "light" ? "Escuro" : "Claro"}</b></button>
            <button className="primary desktop-cta" onClick={() => setModal("loan")}>＋ Novo empréstimo</button>
            <button className="mini-profile" onClick={() => setModal("profile")}><span>JS</span></button>
          </div>
        </header>

        <section className="welcome-mobile"><div><small>Saldo a receber</small><strong>{money.format(51832.4)}</strong><span>↗ 8,2% neste mês</span></div><button onClick={() => setModal("loan")}>＋</button></section>

        <div className="metrics">
          <article><div className="metric-top"><span className="metric-icon blue">↗</span><span className="trend up">+12,5%</span></div><p>Total emprestado</p><h2>{money.format(42750)}</h2><small>14 empréstimos ativos</small></article>
          <article><div className="metric-top"><span className="metric-icon green">$</span><span className="trend up">+8,2%</span></div><p>Total a receber</p><h2>{money.format(51832.4)}</h2><small>Capital + juros previstos</small></article>
          <article><div className="metric-top"><span className="metric-icon purple">✓</span><span className="trend up">+5,4%</span></div><p>Recebido este mês</p><h2>{money.format(7890)}</h2><small>9 parcelas recebidas</small></article>
          <article><div className="metric-top"><span className="metric-icon orange">!</span><span className="trend warning">3 pendentes</span></div><p>Parcelas em atraso</p><h2>{money.format(2140.5)}</h2><small>Requer sua atenção</small></article>
        </div>

        <div className="quick-actions">
          <button onClick={() => setModal("client")}><span className="quick blue">＋</span><b>Novo cliente</b></button>
          <button onClick={() => setModal("loan")}><span className="quick green">$</span><b>Empréstimo</b></button>
          <button onClick={() => setModal("payments")}><span className="quick purple">✓</span><b>Receber</b></button>
          <button onClick={() => setModal("reports")}><span className="quick orange">▥</span><b>Relatório</b></button>
        </div>

        <div className="main-grid">
          <section className="panel loans">
            <div className="panel-title"><div><h3>Empréstimos recentes</h3><p>Últimas movimentações</p></div><button onClick={() => setModal("loans")}>Ver todos →</button></div>
            <div className="loan-list">{loans.map((loan, index) => <button className="loan-row" key={loan.name} onClick={() => setModal("loan")}>
              <span className={`client-avatar a${index}`}>{loan.initials}</span>
              <span className="client-name"><strong>{loan.name}</strong><small>{money.format(loan.value)} • {loan.due}</small></span>
              <span className="parcel"><small>Parcela</small><strong>{money.format(loan.parcel)}</strong></span>
              <span className={`badge ${loan.tone}`}>{loan.status}</span><b className="row-arrow">›</b>
            </button>)}</div>
          </section>

          <section className="panel simulator">
            <div className="panel-title"><div><h3>Simulador rápido</h3><p>Calcule antes de emprestar</p></div><span className="calc-icon">%</span></div>
            <label>Valor do empréstimo<div className="input-money"><span>R$</span><input aria-label="Valor do empréstimo" type="number" min="100" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div></label>
            <div className="two-fields"><label>Juros ao mês<div className="suffix"><input aria-label="Juros ao mês" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /><span>%</span></div></label><label>Número de parcelas<select aria-label="Número de parcelas" value={months} onChange={(e) => setMonths(Number(e.target.value))}>{[3, 6, 10, 12, 18, 24, 36].map((n) => <option key={n}>{n}</option>)}</select></label></div>
            <label>Pagamento a cada<select aria-label="Intervalo entre pagamentos" value={frequencyDays} onChange={(e) => setFrequencyDays(Number(e.target.value))}><option value="7">7 dias (semanal)</option><option value="15">15 dias (quinzenal)</option><option value="30">30 dias (mensal)</option><option value="45">45 dias</option><option value="60">60 dias (bimestral)</option></select></label>
            <div className="schedule-hint"><span>◷</span><div><b>Primeiro pagamento em {frequencyDays} dias</b><small>Previsão: {calc.firstDue.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</small></div></div>
            <div className="result"><div><span>Valor de cada parcela</span><strong>{money.format(calc.installment)}</strong></div><div><span>Juros total</span><b>{money.format(calc.interest)}</b></div><div><span>Total a receber</span><b>{money.format(calc.total)}</b></div></div>
            <button className="primary full" onClick={() => setModal("loan")}>Continuar</button>
          </section>
        </div>

        <section className="bottom-grid">
          <div className="panel"><div className="panel-title"><div><h3>Resumo de agosto</h3><p>Desempenho mensal</p></div><span className="percentage">85%</span></div><div className="summary-values"><div><span>Previsto</span><strong>{money.format(9234)}</strong></div><div><span>Recebido</span><strong>{money.format(7890)}</strong></div><div><span>Restante</span><strong>{money.format(1344)}</strong></div></div><div className="progress"><span /></div></div>
          <div className="panel"><div className="panel-title"><div><h3>Próximos vencimentos</h3><p>Parcelas nos próximos 7 dias</p></div><button onClick={() => setModal("payments")}>Ver agenda →</button></div><div className="due-cards"><div><b>HOJE</b><strong>2 parcelas</strong><span>{money.format(1098.42)}</span></div><div><b>12 AGO</b><strong>3 parcelas</strong><span>{money.format(1846.7)}</span></div><div><b>14 AGO</b><strong>1 parcela</strong><span>{money.format(620.42)}</span></div></div></div>
        </section>
      </section>

      <nav className="mobile-nav">{nav.map((item) => <button key={item.label} className={!item.key ? "active" : ""} onClick={() => setModal(item.key)}><span>{item.icon}</span><small>{item.label}</small></button>)}</nav>
      <button className="mobile-fab" onClick={() => setModal("loan")} aria-label="Novo empréstimo">＋</button>
      {modal && <ModalContent type={modal} close={() => setModal(null)} saveClient={saveClient} clients={clients} calc={calc} months={months} frequencyDays={frequencyDays} setFrequencyDays={setFrequencyDays} open={setModal} success={(message) => { setModal(null); setToast(message); }} />}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  );
}

function ModalContent({ type, close, saveClient, clients, calc, months, frequencyDays, setFrequencyDays, open, success }: { type: Exclude<Modal, null>; close: () => void; saveClient: (event: FormEvent<HTMLFormElement>) => void; clients: Client[]; calc: { installment: number; total: number; interest: number; firstDue: Date; finalDue: Date }; months: number; frequencyDays: number; setFrequencyDays: (days: number) => void; open: (type: Modal) => void; success: (message: string) => void }) {
  const titles: Record<Exclude<Modal, null>, [string, string]> = {
    client: ["Novo cliente", "Cadastre apenas as informações essenciais."], loan: ["Novo empréstimo", "Revise a simulação antes de continuar."], clients: ["Clientes", `${clients.length} pessoas cadastradas`], loans: ["Empréstimos", "Acompanhe toda a sua carteira"], payments: ["Parcelas", "Próximos recebimentos e atrasos"], reports: ["Relatórios", "Resumo financeiro da sua operação"], help: ["Ajuda e suporte", "Como podemos ajudar?"], profile: ["Minha conta", "Preferências e dados do usuário"],
  };
  return <div className="modal-backdrop" role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && close()}><section className="modal-sheet">
    <div className="modal-head"><div><h2>{titles[type][0]}</h2><p>{titles[type][1]}</p></div><button onClick={close} aria-label="Fechar">×</button></div>
    {type === "client" && <form className="clean-form" onSubmit={saveClient}><label>Nome completo<input name="name" autoFocus required placeholder="Ex.: Ana Oliveira" /></label><label>Telefone<input name="phone" required placeholder="(00) 00000-0000" inputMode="tel" /></label><label>CPF <small>opcional</small><input name="cpf" placeholder="000.000.000-00" inputMode="numeric" /></label><button className="primary full" type="submit">Cadastrar cliente</button></form>}
    {type === "loan" && <div><div className="loan-resume"><span>{months} parcelas de</span><strong>{money.format(calc.installment)}</strong><div><small>Juros: {money.format(calc.interest)}</small><small>Total: {money.format(calc.total)}</small></div></div><label className="modal-label">Cliente<select><option>Selecione um cliente</option>{clients.map((client) => <option key={client.name}>{client.name}</option>)}</select></label><label className="modal-label">Receber a cada<select value={frequencyDays} onChange={(e) => setFrequencyDays(Number(e.target.value))}><option value="7">7 dias (semanal)</option><option value="15">15 dias (quinzenal)</option><option value="30">30 dias (mensal)</option><option value="45">45 dias</option><option value="60">60 dias (bimestral)</option></select></label><div className="payment-calendar"><div><small>Primeira parcela</small><b>{calc.firstDue.toLocaleDateString("pt-BR")}</b></div><span>→</span><div><small>Última parcela</small><b>{calc.finalDue.toLocaleDateString("pt-BR")}</b></div></div><button className="primary full" onClick={() => success(`Empréstimo com pagamento a cada ${frequencyDays} dias salvo`)}>Salvar simulação</button></div>}
    {type === "clients" && <div><button className="outline-action" onClick={() => open("client")}>＋ Cadastrar novo cliente</button><div className="modal-list">{clients.map((client, index) => <div key={client.name}><span className={`client-avatar a${index % 3}`}>{client.initials}</span><span><strong>{client.name}</strong><small>{client.phone} • {client.cpf}</small></span><b>›</b></div>)}</div></div>}
    {type === "loans" && <div className="modal-list">{loans.map((loan, index) => <div key={loan.name}><span className={`client-avatar a${index}`}>{loan.initials}</span><span><strong>{loan.name}</strong><small>{money.format(loan.value)} • {loan.due}</small></span><span className={`badge ${loan.tone}`}>{loan.status}</span></div>)}</div>}
    {type === "payments" && <div className="feature-body"><div className="feature-stat"><small>A receber esta semana</small><strong>{money.format(3565.54)}</strong></div><div className="modal-list"><div><span className="date-box">HOJE</span><span><strong>Roberto Lima</strong><small>Parcela 3 de 6</small></span><b>{money.format(516.18)}</b></div><div><span className="date-box">12 AGO</span><span><strong>Mariana Souza</strong><small>Parcela 4 de 10</small></span><b>{money.format(620.42)}</b></div></div></div>}
    {type === "reports" && <div className="report-grid"><div><small>Lucro previsto</small><strong>{money.format(9082.4)}</strong><span>+11,8%</span></div><div><small>Taxa de recebimento</small><strong>85,4%</strong><span>Este mês</span></div><div className="report-wide"><small>Evolução mensal</small><div className="bars"><i style={{height:"35%"}}/><i style={{height:"52%"}}/><i style={{height:"47%"}}/><i style={{height:"75%"}}/><i style={{height:"88%"}}/><i style={{height:"68%"}}/></div></div></div>}
    {type === "help" && <div className="help-list"><button><span>?</span><b>Como cadastrar um empréstimo?</b><i>›</i></button><button><span>◷</span><b>Como registrar um pagamento?</b><i>›</i></button><button><span>☏</span><b>Falar com o suporte</b><i>›</i></button></div>}
    {type === "profile" && <div className="profile-modal"><span className="big-avatar">JS</span><strong>João Silva</strong><small>joao@credfacil.com.br</small><button className="outline-action">Editar meus dados</button><button className="danger-link">Sair da conta</button></div>}
  </section></div>;
}
