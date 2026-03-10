# AgencyHub Backend

API REST multi-tenant para gestão de agências de marketing.  
Stack: **NestJS · PostgreSQL 15 · TypeORM · JWT · Swagger**

---

## Pré-requisitos

- Node.js 20 LTS
- PostgreSQL 15
- npm

---

## Configuração

```bash
npm install
cp .env.example .env   # edite com suas credenciais
npm run migration:run  # cria todas as tabelas
npm run seed           # popula dados de dev
npm run start:dev
```

**Credenciais do seed:**

| Role          | Email                          | Senha       |
|---------------|--------------------------------|-------------|
| Admin         | admin@agencyhub.com            | Admin@123   |
| Agency Owner  | mariana@pixelagency.com.br     | Owner@123   |
| Agency Client | pedro@techstart.com.br         | Cliente@123 |

Swagger: `http://localhost:3000/api/docs`

---

## Arquitetura

**Shared Database + Shared Schema** — `agency_id` em todas as tabelas.  
`TenantGuard` injeta o `agencyId` via JWT automaticamente.

### Roles
| Role            | Descrição                    |
|-----------------|------------------------------|
| `admin`         | Administrador da plataforma  |
| `agency_owner`  | Dono/membro da agência       |
| `agency_client` | Cliente final da agência     |

---

## Endpoints

### Auth — `/api/v1/auth`
`POST /login` · `GET /me` · `POST /logout`

### Admin — `/api/v1/admin/*`
| Recurso   | Destaques                             |
|-----------|---------------------------------------|
| dashboard | MRR, agências ativas, tickets abertos |
| agencies  | CRUD + /:id/stats                     |
| users     | CRUD + toggle-active + password       |
| tickets   | CRUD + messages (auto-reopen)         |
| revenue   | CRUD + /summary MRR                   |
| goals     | CRUD + /progress (auto-complete)      |
| reminders | CRUD + /toggle                        |
| audit     | GET somente, imutável                 |

### Agency — `/api/v1/agency/*`
| Recurso   | Destaques                              |
|-----------|----------------------------------------|
| clients   | CRUD + cria user login opcional        |
| campaigns | CRUD + /metrics                        |
| crm       | CRUD + /board + /:id/stage             |
| projects  | CRUD                                   |
| kanban    | /board + /tasks + /tasks/:id/move      |
| calendar  | CRUD + filtro por período              |
| reports   | CRUD + /approve + /request-adjustment  |
| invoices  | CRUD + /pay + /cancel                  |
| documents | CRUD                                   |
| chat      | /conversations + /messages + /read     |
| support   | Tickets + mensagens                    |
| goals     | CRUD + /progress                       |
| financial | CRUD + summary (income/expense/balance)|
| users     | /invite + toggle-active + CRUD         |
| settings  | Perfil agência + perfil pessoal        |

### Client — `/api/v1/client/*`
| Recurso   | Destaques                             |
|-----------|---------------------------------------|
| dashboard | Resumo campanhas, faturas, métricas   |
| campaigns | Somente leitura                       |
| reports   | Leitura + /approve + /request-adjust  |
| documents | Somente leitura                       |
| financial | Faturas + summary financeiro          |
| support   | Abrir tickets + responder             |
| messages  | Chat com a agência + /read            |

---

## Scripts

```bash
npm run start:dev        # Dev hot-reload
npm run build            # Compilar
npm run start:prod       # Produção
npm run migration:run    # Rodar migrations
npm run migration:revert # Reverter migration
npm run seed             # Popular banco (dev)
npm run test             # Testes
npm run test:cov         # Cobertura
npm run lint             # Lint + fix
```

---

## Variáveis de Ambiente

```env
DATABASE_URL=postgresql://user:password@localhost:5432/agencyhub
JWT_SECRET=seu-segredo-aqui
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

---

## Estrutura

```
src/
├── auth/               # JWT, Guards, Decorators, Strategies
├── common/             # AuditService, ClientContextService
├── config/             # DatabaseConfig
├── database/
│   ├── entities/       # 18 entities TypeORM
│   ├── migrations/     # Migration inicial completa
│   └── seeds/          # Seed com dados realistas
└── modules/
    ├── admin/          # 8 recursos
    ├── agency/         # 15 recursos
    └── client/         # 7 recursos
```

## Padrões de Resposta

```json
// Lista
{ "data": [], "total": 10, "page": 1, "limit": 20, "totalPages": 1 }

// Erro
{ "statusCode": 404, "message": "Recurso não encontrado" }
```
