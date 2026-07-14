export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type Timestamps = { created_at: string; updated_at: string };

export type ProfileRow = Timestamps & {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  base_currency: string;
  locale: string;
  timezone: string;
};

export type FlowRow = Timestamps & {
  id: string;
  user_id: string;
  name: string;
  country_code: string | null;
  currency: string;
  color: string;
  position: number;
  is_archived: boolean;
};

export type AccountRow = Timestamps & {
  id: string;
  user_id: string;
  flow_id: string;
  name: string;
  type: "checking" | "savings" | "cash" | "credit" | "investment";
  currency: string;
  opening_balance_minor: number;
  institution_name: string | null;
  color: string;
  is_archived: boolean;
};

export type CategoryRow = Timestamps & {
  id: string;
  user_id: string;
  name: string;
  kind: "income" | "expense";
  icon: string;
  color: string;
  is_system: boolean;
};

export type TransactionRow = Timestamps & {
  id: string;
  user_id: string;
  flow_id: string;
  account_id: string;
  category_id: string | null;
  transfer_account_id: string | null;
  type: "income" | "expense" | "transfer";
  status: "pending" | "cleared";
  amount_minor: number;
  currency: string;
  description: string;
  notes: string | null;
  occurred_on: string;
  metadata: Json;
};

export type GoalRow = Timestamps & {
  id: string;
  user_id: string;
  name: string;
  target_minor: number;
  currency: string;
  target_date: string | null;
  color: string;
  is_completed: boolean;
};

export type BudgetRow = Timestamps & {
  id: string;
  user_id: string;
  category_id: string;
  month: string;
  amount_minor: number;
  currency: string;
};

export type GoalContributionRow = {
  id: string;
  user_id: string;
  goal_id: string;
  amount_minor: number;
  contributed_on: string;
  note: string | null;
  created_at: string;
};

type OwnedInsert<Row extends { id: string; created_at: string; updated_at: string }> =
  Omit<Row, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, Omit<ProfileRow, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }>;
      flows: Table<FlowRow, OwnedInsert<FlowRow>>;
      accounts: Table<AccountRow, OwnedInsert<AccountRow>>;
      categories: Table<CategoryRow, OwnedInsert<CategoryRow>>;
      transactions: Table<TransactionRow, OwnedInsert<TransactionRow>>;
      budgets: Table<BudgetRow, OwnedInsert<BudgetRow>>;
      goals: Table<GoalRow, OwnedInsert<GoalRow>>;
      goal_contributions: Table<GoalContributionRow, Omit<GoalContributionRow, "id" | "created_at"> & { id?: string; created_at?: string }>;
    };
    Views: {
      account_balances: {
        Row: { account_id: string | null; user_id: string | null; currency: string | null; balance_minor: number | null };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
