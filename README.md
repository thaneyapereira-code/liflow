# LIFLOW

**Sua vida em fluxos.**

Monorepo do hub pessoal LIFLOW. O primeiro produto vertical é um MVP financeiro com visão consolidada de contas, transações, orçamento e metas.

## Stack

- `apps/web`: Next.js 16, React 19 e App Router
- `apps/mobile`: Expo SDK 57, React Native e Expo Router
- `packages/domain`: tipos, dados demonstrativos e regras compartilhadas
- Backend planejado: Supabase (Postgres, Auth, Storage e Row Level Security)

## Executar

```bash
npm install
npm run dev:web
```

Em outro terminal:

```bash
npm run dev:mobile
```

## Escopo do MVP

1. Autenticação e onboarding
2. Contas/fluxos por país e moeda
3. Receitas, despesas e transferências
4. Orçamento mensal e categorização
5. Metas financeiras
6. Dashboard e relatórios básicos

Consulte [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para a evolução técnica.

