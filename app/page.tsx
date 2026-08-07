"use client";

import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const loans = [
  { name: "Mariana Souza", initials: "MS", value: 5000, parcel: 620.42, status: "Em dia", tone: "green", due: "12 Ago" },
  { name: "Roberto Lima", initials: "RL", value: 2800, parcel: 516.18, status: "Vence hoje", tone: "amber", due: "Hoje" },
  { name: "Camila Rocha", initials: "CR", value: 8500, parcel: 997.64, status: "Atrasado", tone: "red", due: "03 Ago" },
  { name: "Diego Martins", initials: "DM", value: 3200, parcel: 590.74, status: "Em dia", tone: "green", due: "18 Ago" },
];

export default function Home() {
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(10);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const calc = useMemo(() => {
    const r = rate / 100;
    const installment = r === 0 ? amount / months : amount * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = installment * months;
    return { installment, total, interest: total - amount };
  }, [amount, rate, months]);

  return (
    <main className="app-shell">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="brand"><span className="brand-mark">$</span><span>CredFácil</span></div>
        <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">×</button>
        <nav>
          <a className="active" href="#painel"><span>⌂</span>Painel</a>
          <a href="#clientes"><span>♙</span>Clientes</a>
          <a href="#emprestimos"><span>▤</span>Empréstimos</a>
          <a href="#parcelas"><span>◷</span>Parcelas</a>
          <a href="#relatorios"><span>▥</span>Relatórios</a>
        </nav>
        <div className="sidebar-bottom">
          <a href="#ajuda"><span>?</span>Ajuda e suporte</a>
          <div className="profile"><div className="avatar">JS</div><div><strong>João Silva</strong><small>Administrador</small></div><button>⋮</button></div>
        </div>
      </aside>

      <section className="content" id="painel">
        <header>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">☰</button>
          <div><h1>Olá, João! <span>👋</span></h1><p>Acompanhe seus empréstimos e recebimentos.</p></div>
          <div className="header-actions"><button className="icon-button" aria-label="Notificações">♢<i /></button><button className="primary" onClick={() => setModal(true)}>＋ Novo empréstimo</button></div>
        </header>

        <div className="metrics">
          <article><div className="metric-top"><span className="metric-icon blue">↗</span><span className="trend up">↗ 12,5%</span></div><p>Total emprestado</p><h2>{money.format(42750)}</h2><small>Em 14 empréstimos ativos</small></article>
          <article><div className="metric-top"><span className="metric-icon green">$</span><span className="trend up">↗ 8,2%</span></div><p>Total a receber</p><h2>{money.format(51832.4)}</h2><small>Capital + juros previstos</small></article>
          <article><div className="metric-top"><span className="metric-icon purple">✓</span><span className="trend up">↗ 5,4%</span></div><p>Recebido este mês</p><h2>{money.format(7890)}</h2><small>9 parcelas recebidas</small></article>
          <article><div className="metric-top"><span className="metric-icon orange">!</span><span className="trend down">3 pendentes</span></div><p>Parcelas em atraso</p><h2>{money.format(2140.5)}</h2><small>Requer sua atenção</small></article>
        </div>

        <div className="main-grid">
          <section className="panel loans" id="emprestimos">
            <div className="panel-title"><div><h3>Empréstimos recentes</h3><p>Últimas movimentações da sua carteira</p></div><button>Ver todos →</button></div>
            <div className="loan-list">
              {loans.map((loan) => <div className="loan-row" key={loan.name}>
                <div className={`client-avatar a${loan.initials.charCodeAt(0) % 4}`}>{loan.initials}</div>
                <div className="client-name"><strong>{loan.name}</strong><small>Empréstimo de {money.format(loan.value)}</small></div>
                <div className="parcel"><small>Parcela</small><strong>{money.format(loan.parcel)}</strong></div>
                <div className="due"><small>Vencimento</small><strong>{loan.due}</strong></div>
                <span className={`badge ${loan.tone}`}>{loan.status}</span>
                <button className="more">•••</button>
              </div>)}
            </div>
          </section>

          <section className="panel simulator">
            <div className="panel-title"><div><h3>Simulador rápido</h3><p>Calcule um novo empréstimo</p></div><span className="calc-icon">⌁</span></div>
            <label>Valor do empréstimo<div className="input-money"><span>R$</span><input aria-label="Valor do empréstimo" type="number" value={amount} min="100" onChange={(e) => setAmount(Number(e.target.value))} /></div></label>
            <div className="two-fields">
              <label>Juros ao mês<div className="suffix"><input aria-label="Juros ao mês" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /><span>%</span></div></label>
              <label>Nº de parcelas<select aria-label="Número de parcelas" value={months} onChange={(e) => setMonths(Number(e.target.value))}>{[3,6,10,12,18,24,36].map(n => <option key={n} value={n}>{n}x</option>)}</select></label>
            </div>
            <div className="result"><div><span>Valor da parcela</span><strong>{money.format(calc.installment)}</strong></div><div><span>Total de juros</span><b>{money.format(calc.interest)}</b></div><div><span>Total a receber</span><b>{money.format(calc.total)}</b></div></div>
            <button className="primary full" onClick={() => setModal(true)}>Criar empréstimo</button>
          </section>
        </div>

        <section className="bottom-grid">
          <div className="panel month-summary"><div className="panel-title"><div><h3>Resumo de agosto</h3><p>Seu desempenho financeiro no mês</p></div><button>⋮</button></div><div className="summary-values"><div><span>Previsto</span><strong>{money.format(9234)}</strong></div><div><span>Recebido</span><strong>{money.format(7890)}</strong></div><div><span>Restante</span><strong>{money.format(1344)}</strong></div></div><div className="progress"><span style={{ width: "85%" }} /></div><p className="progress-copy"><b>85,4%</b> da meta mensal recebida</p></div>
          <div className="panel next-due"><div className="panel-title"><div><h3>Próximos vencimentos</h3><p>Parcelas nos próximos 7 dias</p></div><button>Ver agenda →</button></div><div className="due-cards"><div><b>HOJE</b><strong>2 parcelas</strong><span>{money.format(1098.42)}</span></div><div><b>12 AGO</b><strong>3 parcelas</strong><span>{money.format(1846.7)}</span></div><div><b>14 AGO</b><strong>1 parcela</strong><span>{money.format(620.42)}</span></div></div></div>
        </section>
      </section>

      {modal && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal"><button className="modal-close" onClick={() => setModal(false)}>×</button><span className="modal-symbol">✓</span><h2>Simulação pronta!</h2><p>Em seguida, esta etapa permitirá escolher um cliente, confirmar as condições e gerar o contrato.</p><div className="modal-resume"><span>{months} parcelas de</span><strong>{money.format(calc.installment)}</strong><small>Total: {money.format(calc.total)}</small></div><button className="primary full" onClick={() => setModal(false)}>Entendi</button></div></div>}
    </main>
  );
}
