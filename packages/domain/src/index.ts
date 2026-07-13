export type Currency = "EUR" | "BRL" | "USD";

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

export function formatMoney(value: number, currency: Currency = "EUR") {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency }).format(value);
}

export function goalProgress(goal: Goal) {
  return Math.min(100, Math.round((goal.current / goal.target) * 100));
}

