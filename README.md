# AgencyHub — Guia de Execução Local (Windows)

## Pré-requisitos

1. **Node.js 20+** → https://nodejs.org
2. **PostgreSQL 15+** → https://www.postgresql.org/download/windows
3. **pnpm** → após instalar o Node, rode no PowerShell: `npm install -g pnpm`

---

## Passo a Passo

### 1. Iniciar o PostgreSQL
- `Win + R` → `services.msc` → procure `postgresql-x64-15` → clique Iniciar
- Ou abra o **pgAdmin** e inicie o servidor

### 2. Criar o banco
No pgAdmin ou psql:
```sql
CREATE DATABASE agency_hub;
```

### 3. Configurar senha
Abra `backend\.env` e ajuste:
```
DB_PASSWORD=SUA_SENHA_AQUI
```

### 4. Setup (primeira vez)
Clique duas vezes em **setup.bat**

### 5. Iniciar
- **iniciar-backend.bat** → aguarda `🚀 rodando em http://localhost:3001`
- **iniciar-frontend.bat** → aguarda `Local: http://localhost:3000`

### 6. Acessar
http://localhost:3000/login

## Credenciais

| Portal | Email | Senha |
|---|---|---|
| Admin | admin@agencyhub.com | Admin@123 |
| Agência | mariana@pixelagency.com.br | Owner@123 |
| Cliente | pedro@techstart.com.br | Cliente@123 |

## Erros Comuns

- **ECONNREFUSED 5432** → PostgreSQL não está rodando (passo 1)
- **Cannot find module** → Delete a pasta `backend\dist` e tente novamente
- **Migration failed** → Verifique banco criado e senha no `.env`
