# Configuração do Supabase

O código já contém o schema, as políticas de segurança e os clientes web/mobile. Falta apenas criar um projeto Supabase e fornecer as chaves públicas.

## 1. Criar o projeto

Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard). No painel **Connect**, copie:

- Project URL
- Publishable key

Nunca coloque `service_role` ou secret keys em variáveis `NEXT_PUBLIC_*` ou `EXPO_PUBLIC_*`.

## 2. Aplicar o banco

Opção rápida: abra o SQL Editor do Supabase e execute o conteúdo de:

`supabase/migrations/202607140001_initial_finance.sql`

Opção com CLI:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

## 3. Configurar o web

Copie `apps/web/.env.example` para `apps/web/.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

## 4. Configurar o mobile

Copie `apps/mobile/.env.example` para `apps/mobile/.env` e use os mesmos valores:

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Reinicie os servidores após alterar variáveis de ambiente.

## Segurança implementada

- RLS habilitado em todas as tabelas expostas.
- Cada política exige `auth.uid() = user_id`.
- Índices nas colunas usadas pelas políticas.
- Chaves estrangeiras compostas impedem relacionar objetos de usuários diferentes.
- Valores monetários usam inteiros em unidades mínimas.
- Saldos são calculados a partir dos lançamentos, não mantidos manualmente.
- A chave privilegiada do servidor não é necessária nos aplicativos.

## Primeiro teste

1. Execute `npm run dev:web`.
2. Acesse `/entrar`.
3. Crie uma conta.
4. Confira em **Authentication > Users** se o usuário foi criado.
5. Confira em **Table Editor > profiles** se o perfil e as categorias padrão foram gerados.

