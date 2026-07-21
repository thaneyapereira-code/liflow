import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChartNoAxesCombined,
  ChevronDown,
  CircleDollarSign,
  Goal,
  Grid2X2,
  Landmark,
  LayoutDashboard,
  Plus,
  ReceiptText,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Target,
  WalletCards
} from "lucide-react";
import { dashboard, formatMoney, goalProgress } from "@liflow/domain";
import Image from "next/image";
import Link from "next/link";

const nav = [
  ["Visão geral", LayoutDashboard, "/"],
  ["Transações", ReceiptText, "/transacoes"],
  ["Fluxos", SlidersHorizontal, "#"],
  ["Planejamento", WalletCards, "#"],
  ["Metas", Target, "#"],
  ["Relatórios", ChartNoAxesCombined, "#"],
  ["Categorias", Grid2X2, "#"]
] as const;

function Brand() {
  return (
    <div className="brand" aria-label="LIFLOW">
      <Image className="brand-logo" src="/brand/liflow-mark.png" alt="" width={36} height={36} priority />
      <span>LIFLOW</span>
    </div>
  );
}

function Trend({ positive = true, children }: { positive?: boolean; children: React.ReactNode }) {
  return <span className={positive ? "trend positive" : "trend negative"}>{positive ? <ArrowUpRight /> : <ArrowDownRight />}{children}</span>;
}

function Sparkline({ variant = "green" }: { variant?: "green" | "blue" | "purple" }) {
  return <div className={`sparkline ${variant}`}><i /><i /><i /><i /><i /></div>;
}

export default function Home() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <Brand />
        <nav>
          {nav.map(([label, Icon, href], index) => (
            <Link className={index === 0 ? "active" : ""} href={href} key={label}><Icon />{label}</Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a href="#"><Settings />Configurações</a>
          <div className="ai-card">
            <span><Sparkles /></span>
            <div><b>Insights LIFLOW</b><small>3 sugestões para você</small></div>
            <ArrowUpRight />
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header>
          <div><p className="eyebrow">DASHBOARD</p><h1>Visão geral</h1></div>
          <div className="header-actions">
            <button className="icon-button" aria-label="Notificações"><Bell /></button>
            <Link className="profile" href="/entrar"><span>T</span><div><b>{dashboard.user}</b><small>Conta pessoal</small></div><ChevronDown /></Link>
          </div>
        </header>

        <div className="welcome">
          <div><h2>Olá, {dashboard.user} <span>✦</span></h2><p>Aqui está o ritmo da sua vida financeira neste mês.</p></div>
          <div className="toolbar"><button>{dashboard.month}<ChevronDown /></button><Link className="primary" href="/transacoes?nova=1"><Plus />Nova transação</Link></div>
        </div>

        <section className="metric-grid">
          <article className="metric featured">
            <div className="metric-head"><span>Saldo atual</span><i className="metric-icon"><CircleDollarSign /></i></div>
            <strong>{formatMoney(dashboard.balance)}</strong><Trend>12% vs. mês anterior</Trend><Sparkline />
          </article>
          <article className="metric">
            <div className="metric-head"><span>Receitas</span><i className="metric-icon income"><ArrowUpRight /></i></div>
            <strong>{formatMoney(dashboard.income)}</strong><Trend>8% vs. mês anterior</Trend><Sparkline />
          </article>
          <article className="metric">
            <div className="metric-head"><span>Despesas</span><i className="metric-icon expense"><ArrowDownRight /></i></div>
            <strong>{formatMoney(dashboard.expenses)}</strong><Trend positive={false}>5% vs. mês anterior</Trend><Sparkline variant="blue" />
          </article>
          <article className="metric">
            <div className="metric-head"><span>Investimentos</span><i className="metric-icon invest"><Landmark /></i></div>
            <strong>{formatMoney(dashboard.investments)}</strong><Trend>15% vs. mês anterior</Trend><Sparkline variant="purple" />
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="panel flows-panel">
            <div className="panel-head"><div><p className="eyebrow">CONTAS E PAÍSES</p><h3>Seus fluxos</h3></div><a href="#">Ver todos</a></div>
            <div className="flow-table">
              <div className="flow-row labels"><span>Fluxo</span><span>Receitas</span><span>Despesas</span><span>Saldo</span></div>
              {dashboard.flows.map((flow) => <div className="flow-row" key={flow.id}>
                <span className="flow-name"><i>{flow.countryCode === "BR" ? "🇧🇷" : "🇵🇹"}</i><span><b>{flow.name}</b><small>{flow.currency}</small></span></span>
                <span>{formatMoney(flow.income)}</span><span>{formatMoney(flow.expenses)}</span><span className="money-positive">{formatMoney(flow.balance)}</span>
              </div>)}
            </div>
            <div className="flow-total"><b>Total</b><span>{formatMoney(dashboard.income)}</span><span>{formatMoney(dashboard.expenses)}</span><strong>{formatMoney(dashboard.balance)}</strong></div>
          </article>

          <article className="panel categories-panel">
            <div className="panel-head"><div><p className="eyebrow">DISTRIBUIÇÃO</p><h3>Gastos por categoria</h3></div><button className="more">•••</button></div>
            <div className="category-content">
              <div className="donut"><div><b>{formatMoney(dashboard.expenses)}</b><small>Total</small></div></div>
              <ul>
                <li><i className="c1" /><span>Moradia</span><b>40%</b></li>
                <li><i className="c2" /><span>Alimentação</span><b>20%</b></li>
                <li><i className="c3" /><span>Transporte</span><b>15%</b></li>
                <li><i className="c4" /><span>Estilo de vida</span><b>15%</b></li>
                <li><i className="c5" /><span>Outros</span><b>10%</b></li>
              </ul>
            </div>
          </article>

          <article className="panel evolution-panel">
            <div className="panel-head"><div><p className="eyebrow">ÚLTIMOS 6 MESES</p><h3>Evolução do saldo</h3></div><button>6 meses <ChevronDown /></button></div>
            <div className="chart-area">
              <div className="y-axis"><span>€ 3k</span><span>€ 2k</span><span>€ 1k</span><span>€ 0</span></div>
              <div className="chart"><div className="chart-line" /><span className="m1">Fev</span><span className="m2">Mar</span><span className="m3">Abr</span><span className="m4">Mai</span><span className="m5">Jun</span><span className="m6">Jul</span></div>
            </div>
          </article>

          <article className="panel goals-panel">
            <div className="panel-head"><div><p className="eyebrow">OBJETIVOS</p><h3>Metas</h3></div><a href="#">Ver todas</a></div>
            <div className="goals">
              {dashboard.goals.map((goal) => <div className="goal-item" key={goal.id}>
                <span className="goal-icon" style={{ color: goal.accent, background: `${goal.accent}16` }}><Goal /></span>
                <div><b>{goal.name}</b><small>{formatMoney(goal.current)} de {formatMoney(goal.target)}</small><i><em style={{ width: `${goalProgress(goal)}%`, background: goal.accent }} /></i></div>
                <strong>{goalProgress(goal)}%</strong>
              </div>)}
            </div>
          </article>
        </section>
      </section>

      <nav className="mobile-nav">
        <a className="active" href="#"><LayoutDashboard /><span>Resumo</span></a>
        <a href="#"><ReceiptText /><span>Transações</span></a>
        <button><Plus /></button>
        <a href="#"><SlidersHorizontal /><span>Fluxos</span></a>
        <a href="#"><Grid2X2 /><span>Mais</span></a>
      </nav>
    </main>
  );
}
