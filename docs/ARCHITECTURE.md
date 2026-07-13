# Arquitetura LIFLOW

## Decisão

O LIFLOW usa duas interfaces especializadas no mesmo monorepo: Next.js para a experiência web densa e Expo para uma experiência realmente nativa. Modelos, validações e regras de negócio ficam em pacotes compartilhados; componentes visuais permanecem específicos de cada plataforma.

## Camadas

- **Web:** landing page, dashboard completo e administração.
- **Mobile:** uso diário, lançamento rápido, notificações e biometria.
- **Domínio:** entidades e regras independentes de framework.
- **Dados:** Supabase/Postgres, com RLS por usuário e organização.
- **Integrações futuras:** Open Finance via provedor regulado, jobs assíncronos e IA com ferramentas limitadas por permissão.

## Entidades iniciais

`profiles`, `accounts`, `categories`, `transactions`, `budgets`, `goals`, `goal_contributions` e `recurring_rules`.

Toda tabela financeira deve conter `user_id`, timestamps, moeda em ISO 4217 e valores armazenados em unidades mínimas inteiras. Conversões cambiais nunca substituem o valor e a moeda originais.

## Sequência sugerida

- Fase 1: protótipo navegável e design system.
- Fase 2: Supabase local, autenticação, schema e RLS.
- Fase 3: CRUD de transações/contas e dashboard real.
- Fase 4: orçamentos, metas, recorrências e notificações.
- Fase 5: beta fechado, telemetria e preparação das lojas.

