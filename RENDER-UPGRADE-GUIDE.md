# Guia de Upgrade PostgreSQL no Render — AgencyHub

> **Prazo:** O banco expira em 09/04/2026. Faça o upgrade **antes** dessa data.

---

## 1. Estado das Migrations TypeORM

O projeto possui **4 migrations** (todas devem estar aplicadas em produção):

| # | Arquivo | O que faz |
|---|---------|-----------|
| 1 | `1700000000000-InitialSchema` | Cria as 17 tabelas base + todos os ENUMs |
| 2 | `1700000000001-AddExternalIdAndNotifications` | Adiciona `external_id` em campaigns + tabela `notifications` |
| 3 | `1700000000002-AddPasswordResetFields` | Adiciona `reset_password_token` e `reset_password_expiry` em users |
| 4 | `1700000000003-AddLastLoginColumn` | Adiciona coluna `last_login` em users |

### Como verificar quais migrations foram aplicadas no Render

Conecte no banco via psql (ou pelo shell do Render) e execute:

```sql
SELECT name, timestamp FROM migrations ORDER BY timestamp;
```

Se as 4 linhas aparecerem, o banco está atualizado.
Se faltar alguma, rode antes do upgrade:

```bash
# Na pasta backend/
npm run migration:run
```

---

## 2. Passo a Passo do Backup

### Pré-requisito: ter `pg_dump` instalado

```bash
# Verificar se está disponível:
pg_dump --version

# Se não tiver, instale o PostgreSQL Client:
# https://www.postgresql.org/download/windows/
```

### 2.1 Pegue a URL de conexão no Render

1. Acesse **dashboard.render.com**
2. Clique no seu serviço de banco de dados
3. Em **Connections**, copie a **External Database URL**
   - Formato: `postgresql://user:password@host.render.com:5432/dbname`

### 2.2 Execute o script de backup

Edite o arquivo `backup-render-db.sh` e cole a URL:

```bash
RENDER_DB_URL="postgresql://SEU_USER:SUA_SENHA@SEU_HOST.render.com:5432/SEU_DATABASE"
```

Então execute via Git Bash:

```bash
bash backup-render-db.sh
```

Isso gera um arquivo `agencyhub_backup_YYYYMMDD_HHMMSS.sql` na raiz do projeto.

### 2.3 Confirme que o backup é válido

```bash
# Verifique se o arquivo tem conteúdo e contém as tabelas principais:
grep -c "CREATE TABLE" agencyhub_backup_*.sql
# Deve retornar 18 ou mais

grep "COPY users" agencyhub_backup_*.sql
grep "COPY agencies" agencyhub_backup_*.sql
```

---

## 3. Upgrade no Painel do Render — Passo a Passo

> O Render **não faz upgrade in-place** do PostgreSQL. O processo é:
> criar um novo banco na versão desejada → restaurar os dados → atualizar as variáveis de ambiente.

### Etapa 1 — Criar o novo banco de dados

1. No dashboard do Render, clique em **New +** → **PostgreSQL**
2. Configure:
   - **Name:** `agencyhub-db-prod` (ou similar)
   - **Region:** a mesma do seu backend atual (evita latência)
   - **PostgreSQL Version:** **15** ou **16**
   - **Plan:** escolha o plano pago (Starter $7/mês ou acima)
3. Clique em **Create Database**
4. Aguarde o banco ficar com status **Available** (1–2 min)

### Etapa 2 — Restaurar o backup no novo banco

Pegue a **External Database URL** do banco **novo** e execute:

```bash
# Substitua a URL pelo novo banco:
psql "postgresql://NOVO_USER:NOVA_SENHA@NOVO_HOST.render.com:5432/NOVO_DB" \
  < agencyhub_backup_YYYYMMDD_HHMMSS.sql
```

Verifique se restaurou corretamente:

```bash
psql "postgresql://NOVO_USER:NOVA_SENHA@NOVO_HOST.render.com:5432/NOVO_DB" \
  -c "\dt"
# Deve listar todas as 18+ tabelas
```

### Etapa 3 — Atualizar variáveis de ambiente no backend (Render)

1. No dashboard, vá no serviço de **backend** (Web Service)
2. Clique em **Environment**
3. Atualize as variáveis com os dados do **novo banco**:

   | Variável | Valor novo |
   |----------|-----------|
   | `DB_HOST` | host do novo banco |
   | `DB_PORT` | `5432` |
   | `DB_USERNAME` | usuário do novo banco |
   | `DB_PASSWORD` | senha do novo banco |
   | `DB_DATABASE` | nome do novo banco |

   **Ou**, se usar `DATABASE_URL` direto, substitua pela nova Internal URL.

4. Clique em **Save Changes** → o backend vai fazer redeploy automaticamente

### Etapa 4 — Verificar se o backend conectou

1. Após o redeploy, acesse os **Logs** do serviço de backend
2. Verifique se não há erros de conexão com o banco
3. Teste fazendo login na aplicação

### Etapa 5 — Rodar migrations no novo banco (se necessário)

Se o backup não incluiu a tabela `migrations` do TypeORM:

```bash
# Na pasta backend/, com as variáveis do novo banco no .env:
npm run migration:run
```

### Etapa 6 — Deletar o banco antigo

> Só delete o banco antigo **após confirmar** que tudo funciona no novo.

1. No dashboard, vá no banco **antigo**
2. Clique em **Settings** → **Delete Database**
3. Confirme digitando o nome do banco

---

## 4. Checklist Final

```
[ ] Backup gerado e validado antes de qualquer mudança
[ ] Novo banco criado no Render com plano pago
[ ] Backup restaurado no novo banco
[ ] Tabelas verificadas no novo banco (\dt)
[ ] Variáveis de ambiente do backend atualizadas
[ ] Backend fez redeploy sem erros nos logs
[ ] Login na aplicação funcionando
[ ] Banco antigo deletado
```

---

## 5. Rollback (se algo der errado)

Se o backend der erro após trocar as variáveis:

1. Volte nas variáveis de ambiente e restaure as credenciais do banco **antigo**
2. Salve → o Render vai fazer redeploy para o banco antigo
3. O banco antigo continua disponível até você deletá-lo manualmente

---

## Tabelas do banco (referência para validar restore)

```
agencies, users, clients, campaigns, projects, kanban_tasks,
events, reports, invoices, tickets, ticket_messages, audit_logs,
goals, reminders, financial_transactions, crm_contacts,
documents, chat_messages, notifications, migrations
```
