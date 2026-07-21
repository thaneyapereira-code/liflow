export type Currency = "EUR" | "BRL" | "USD";
export type * from "./database";

export type Flow = {
  id: string;
  countryCode: "PT" | "BR";
  name: string;
  currency: Currency;
  income: number;
  expenses: number;
  balance: number;
};

export type Goal = {
  id: string;
  name: string;
  current: number;
  target: number;
  accent: string;
};

export type DemoTransaction = {
  id: string;
  description: string;
  category: string;
  flow: string;
  kind: "income" | "expense";
  amount: number;
  occurredOn: string;
  status: "cleared" | "pending";
};

export const dashboard = {
  user: "Thaneya",
  month: "Julho 2026",
  balance: 1650.5,
  income: 4850,
  expenses: 3199.5,
  investments: 1200,
  flows: [
    { id: "br", countryCode: "BR", name: "Brasil", currency: "EUR", income: 2800, expenses: 1450, balance: 1350 },
    { id: "pt", countryCode: "PT", name: "Portugal", currency: "EUR", income: 2050, expenses: 1749.5, balance: 300.5 }
  ] satisfies Flow[],
  goals: [
    { id: "reserve", name: "Reserva de emergência", current: 1200, target: 3000, accent: "#29c68f" },
    { id: "travel", name: "Viagem Europa", current: 800, target: 2000, accent: "#2b8cff" },
    { id: "home", name: "Casa própria", current: 15000, target: 50000, accent: "#8b6df6" }
  ] satisfies Goal[]
};

export const demoTransactions: DemoTransaction[] = [
  { id: "tx-1", description: "Salário", category: "Salário", flow: "Portugal", kind: "income", amount: 2400, occurredOn: "2026-07-13", status: "cleared" },
  { id: "tx-2", description: "Supermercado Continente", category: "Alimentação", flow: "Portugal", kind: "expense", amount: 84.5, occurredOn: "2026-07-13", status: "cleared" },
  { id: "tx-3", description: "Projeto freelance", category: "Outras receitas", flow: "Brasil", kind: "income", amount: 530, occurredOn: "2026-07-12", status: "cleared" },
  { id: "tx-4", description: "Combustível", category: "Transporte", flow: "Portugal", kind: "expense", amount: 69, occurredOn: "2026-07-12", status: "cleared" },
  { id: "tx-5", description: "Netflix", category: "Lazer", flow: "Brasil", kind: "expense", amount: 17.99, occurredOn: "2026-07-11", status: "pending" },
  { id: "tx-6", description: "Aluguel", category: "Moradia", flow: "Portugal", kind: "expense", amount: 950, occurredOn: "2026-07-10", status: "cleared" },
  { id: "tx-7", description: "Farmácia", category: "Saúde", flow: "Portugal", kind: "expense", amount: 32.4, occurredOn: "2026-07-09", status: "cleared" }
];

export function formatMoney(value: number, currency: Currency = "EUR") {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency }).format(value);
}

export function goalProgress(goal: Goal) {
  return Math.min(100, Math.round((goal.current / goal.target) * 100));
}
