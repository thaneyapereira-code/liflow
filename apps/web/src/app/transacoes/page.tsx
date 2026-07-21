"use client";

import type { DemoTransaction } from "@liflow/domain";
import { demoTransactions, formatMoney } from "@liflow/domain";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Grid2X2,
  House,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Settings,
  SlidersHorizontal,
  Target,
  Trash2,
  Utensils,
  WalletCards,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Filter = "all" | "income" | "expense";

const storageKey = "liflow.demo.transactions.v1";

const categories = ["Alimentação", "Moradia", "Transporte", "Saúde", "Lazer", "Salário", "Outras receitas", "Outros"];

function categoryIcon(category: string) {
  if (category === "Alimentação") return <Utensils />;
  if (category === "Moradia") return <House />;
  if (category === "Salário" || category === "Outras receitas") return <ArrowUpRight />;
  return <ReceiptText />;
}

function Sidebar() {
  return <aside className={styles.sidebar}>
    <Link className={styles.brand} href="/"><Image src="/brand/liflow-mark.png" alt="" width={34} height={34} priority /><span>LIFLOW</span></Link>
    <nav>
      <Link href="/"><LayoutDashboard />Visão geral</Link>
      <Link className={styles.active} href="/transacoes"><ReceiptText />Transações</Link>
      <a href="#"><SlidersHorizontal />Fluxos</a>
      <a href="#"><WalletCards />Planejamento</a>
      <a href="#"><Target />Metas</a>
      <a href="#"><Grid2X2 />Categorias</a>
    </nav>
    <Link className={styles.settings} href="#"><Settings />Configurações</Link>
  </aside>;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<DemoTransaction[]>(demoTransactions);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [kind, setKind] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Alimentação");
  const [editing, setEditing] = useState<DemoTransaction | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DemoTransaction | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as DemoTransaction[];
        if (Array.isArray(parsed)) setTransactions(parsed);
      }
    } finally {
      setHydrated(true);
    }

    if (new URLSearchParams(window.location.search).get("nova") === "1") {
      openCreate();
      window.history.replaceState(null, "", "/transacoes");
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(transactions));
  }, [hydrated, transactions]);

  const visible = useMemo(() => transactions.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.kind === filter;
    const needle = query.toLocaleLowerCase("pt");
    const matchesQuery = !needle || `${transaction.description} ${transaction.category} ${transaction.flow}`.toLocaleLowerCase("pt").includes(needle);
    return matchesFilter && matchesQuery;
  }), [filter, query, transactions]);

  const totals = useMemo(() => transactions.reduce((result, transaction) => {
    result[transaction.kind] += transaction.amount;
    return result;
  }, { income: 0, expense: 0 }), [transactions]);

  function openCreate() {
    setEditing(null);
    setKind("expense");
    setCategory("Alimentação");
    setModalOpen(true);
  }

  function openEdit(transaction: DemoTransaction) {
    setEditing(transaction);
    setKind(transaction.kind);
    setCategory(transaction.category);
    setOpenMenu(null);
    setModalOpen(true);
  }

  function selectKind(value: "income" | "expense") {
    setKind(value);
    setCategory(value === "income" ? "Salário" : "Alimentação");
  }

  function saveTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) return;

    const transaction: DemoTransaction = {
      id: editing?.id ?? crypto.randomUUID(),
      description: String(form.get("description")),
      category: String(form.get("category")),
      flow: String(form.get("flow")),
      kind,
      amount,
      occurredOn: String(form.get("date")),
      status: editing?.status ?? "cleared"
    };

    setTransactions((current) => editing
      ? current.map((item) => item.id === editing.id ? transaction : item)
      : [transaction, ...current]);
    setModalOpen(false);
    setEditing(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setTransactions((current) => current.filter((transaction) => transaction.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return <main className={styles.shell}>
    <Sidebar />
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>FINANCEIRO</p><h1>Transações</h1><p>Acompanhe cada movimento dos seus fluxos.</p></div>
        <div className={styles.headerRight}><span className={styles.demo}>Dados salvos neste navegador</span><button className={styles.primary} onClick={openCreate}><Plus />Nova transação</button><span className={styles.avatar}>T</span></div>
      </header>

      <section className={styles.summary}>
        <article><span className={styles.summaryIconIncome}><ArrowUpRight /></span><div><small>Receitas no período</small><strong>{formatMoney(totals.income)}</strong><em>+8% este mês</em></div></article>
        <article><span className={styles.summaryIconExpense}><ArrowDownLeft /></span><div><small>Despesas no período</small><strong>{formatMoney(totals.expense)}</strong><em className={styles.red}>-5% este mês</em></div></article>
        <article><span className={styles.summaryIconBalance}><ArrowLeftRight /></span><div><small>Resultado</small><strong className={styles.green}>{formatMoney(totals.income - totals.expense)}</strong><em>Saldo positivo</em></div></article>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.filters}>
            {(["all", "income", "expense"] as const).map((value) => <button className={filter === value ? styles.filterActive : ""} onClick={() => setFilter(value)} key={value}>{value === "all" ? "Todas" : value === "income" ? "Receitas" : "Despesas"}</button>)}
          </div>
          <div className={styles.actions}><label className={styles.search}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar transação" /></label><button className={styles.period}><CalendarDays />Julho 2026<ChevronDown /></button></div>
        </div>

        <div className={styles.tableHead}><span>Descrição</span><span>Fluxo</span><span>Data</span><span>Status</span><span>Valor</span><span /></div>
        <div className={styles.list}>
          {visible.map((transaction) => <article className={styles.row} key={transaction.id}>
            <div className={styles.description}><span className={transaction.kind === "income" ? styles.txIncome : styles.txExpense}>{categoryIcon(transaction.category)}</span><div><b>{transaction.description}</b><small>{transaction.category}</small></div></div>
            <span className={styles.flow}><i>{transaction.flow === "Brasil" ? "🇧🇷" : "🇵🇹"}</i>{transaction.flow}</span>
            <span className={styles.date}>{new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" }).format(new Date(`${transaction.occurredOn}T12:00:00`))}</span>
            <span><i className={transaction.status === "cleared" ? styles.cleared : styles.pending}>{transaction.status === "cleared" ? "Concluída" : "Pendente"}</i></span>
            <strong className={transaction.kind === "income" ? styles.incomeValue : styles.expenseValue}>{transaction.kind === "income" ? "+" : "−"} {formatMoney(transaction.amount)}</strong>
            <div className={styles.rowActions}>
              <button className={styles.more} aria-label={`Opções de ${transaction.description}`} aria-expanded={openMenu === transaction.id} onClick={() => setOpenMenu((current) => current === transaction.id ? null : transaction.id)}><MoreHorizontal /></button>
              {openMenu === transaction.id && <div className={styles.rowMenu}>
                <button onClick={() => openEdit(transaction)}><Pencil />Editar</button>
                <button className={styles.deleteAction} onClick={() => { setDeleteTarget(transaction); setOpenMenu(null); }}><Trash2 />Excluir</button>
              </div>}
            </div>
          </article>)}
          {visible.length === 0 && <div className={styles.empty}><Search /><b>Nenhuma transação encontrada</b><span>Tente alterar a busca ou os filtros.</span></div>}
        </div>
      </section>
    </section>

    <nav className={styles.mobileNav}><Link href="/"><LayoutDashboard /><span>Resumo</span></Link><Link className={styles.mobileActive} href="/transacoes"><ReceiptText /><span>Transações</span></Link><button onClick={openCreate}><Plus /></button><a href="#"><SlidersHorizontal /><span>Fluxos</span></a><a href="#"><MoreHorizontal /><span>Mais</span></a></nav>

    {modalOpen && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="transaction-title">
        <div className={styles.modalHead}><div><p className={styles.eyebrow}>{editing ? "EDITAR MOVIMENTO" : "NOVO MOVIMENTO"}</p><h2 id="transaction-title">{editing ? "Editar transação" : "Nova transação"}</h2></div><button onClick={() => setModalOpen(false)} aria-label="Fechar"><X /></button></div>
        <form key={editing?.id ?? "new"} onSubmit={saveTransaction}>
          <div className={styles.kindTabs}><button type="button" className={kind === "expense" ? styles.kindExpense : ""} onClick={() => selectKind("expense")}><ArrowDownLeft />Despesa</button><button type="button" className={kind === "income" ? styles.kindIncome : ""} onClick={() => selectKind("income")}><ArrowUpRight />Receita</button></div>
          <label className={styles.amountLabel}>Valor<div className={styles.amountInput}><span>€</span><input name="amount" type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="0,00" defaultValue={editing?.amount} autoFocus required /></div></label>
          <label>Descrição<input name="description" placeholder="Ex.: Supermercado" maxLength={140} defaultValue={editing?.description} required /></label>
          <div className={styles.twoColumns}><label>Categoria<select name="category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Fluxo<select name="flow" defaultValue={editing?.flow ?? "Portugal"}><option>Portugal</option><option>Brasil</option></select></label></div>
          <label>Data<input name="date" type="date" defaultValue={editing?.occurredOn ?? "2026-07-21"} required /></label>
          <div className={styles.modalActions}><button type="button" onClick={() => setModalOpen(false)}>Cancelar</button><button className={styles.primary} type="submit">{editing ? "Salvar alterações" : "Salvar transação"}<ArrowUpRight /></button></div>
        </form>
      </section>
    </div>}

    {deleteTarget && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
      <section className={styles.confirm} role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <span className={styles.confirmIcon}><Trash2 /></span>
        <h2 id="delete-title">Excluir transação?</h2>
        <p><b>{deleteTarget.description}</b> será removida deste navegador. Os totais serão recalculados automaticamente.</p>
        <div><button onClick={() => setDeleteTarget(null)}>Cancelar</button><button onClick={confirmDelete}>Excluir transação</button></div>
      </section>
    </div>}
  </main>;
}
