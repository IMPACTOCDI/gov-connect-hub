# Supabase - Gov Connect Hub

## Banco de dados

O schema do banco está em `migrations/20250128120000_initial_schema.sql`.

### Tabelas criadas

| Tabela | Descrição |
|--------|-----------|
| `compradores` | Compradores (entes públicos) cadastrados |
| `empresas_registro` | Cadastro de empresas (pendente / aprovado / rejeitado) |
| `admin_emails` | E-mails autorizados a acessar como administrador |
| `empresas_cadastradas` | Lista de empresas na gestão (Ativo / Pendente / Excluído) |
| `empresas_excluidas` | Nomes de empresas excluídas da listagem |
| `anuncios` | Produtos e serviços das empresas (catálogo) |
| `demandas` | Manifestações de interesse |
| `atas` | Atas de registro de preços |

### Como aplicar o schema no Supabase

**Opção 1 – Pelo Dashboard (recomendado para começar)**

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard) e abra o projeto.
2. Vá em **SQL Editor**.
3. Copie todo o conteúdo de `migrations/20250128120000_initial_schema.sql`.
4. Cole no editor e clique em **Run**.

**Opção 2 – Supabase CLI**

1. Instale o [Supabase CLI](https://supabase.com/docs/guides/cli).
2. No terminal, na raiz do projeto:
   ```bash
   supabase link --project-ref kzhzateetdizroeuewip
   supabase db push
   ```
   (Use o `project-ref` do seu projeto se for diferente.)

### Variáveis de ambiente

O projeto já usa no `.env`:

- `VITE_SUPABASE_URL` – URL do projeto
- `VITE_SUPABASE_PUBLISHABLE_KEY` – Chave anon/public

Para operações no backend (migrations, scripts), use a **service_role key** apenas em ambiente seguro (nunca no frontend).

### Próximos passos (integração com o app)

1. Instalar o cliente: `npm install @supabase/supabase-js`.
2. Criar um cliente Supabase em `src/lib/supabase.ts` usando `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Trocar os contextos que hoje usam `localStorage`/`sessionStorage` por chamadas às tabelas do Supabase (compradores, empresas_registro, demandas, anuncios, atas, etc.).
4. (Opcional) Usar **Supabase Auth** para login e substituir o fluxo atual de comprador/empresa/admin; aí as políticas RLS podem ser ajustadas por `auth.uid()` e papel do usuário.
