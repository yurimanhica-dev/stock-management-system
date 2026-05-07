# 🚀 COMEÇAR AQUI - Guia Rápido

## 1. Instalar Dependências

```bash
cd /vercel/share/
pnpm install
```

## 2. Configurar Banco de Dados

Você precisa de uma variável de ambiente `DATABASE_URL`:

```bash
# .env.local (crie este ficheiro)
DATABASE_URL=postgresql://user:password@host:port/database
```

Ou use Neon (recomendado):

1. Crie um projeto em https://neon.tech
2. Copie a connection string
3. Coloque em `.env.local`

## 3. Criar Admin User

```bash
pnpm seed:admin
```

Isso cria 3 utilizadores:

- admin@example.com / admin123
- manager@example.com / manager123
- sales@example.com / sales123

## 4. Criar Produtos de Exemplo

```bash
pnpm seed:drinks
```

Cria 18 bebidas com imagens e preços.

## 5. Iniciar o Servidor

```bash
pnpm dev
```

Acesse: **http://localhost:3000**

## 6. Fazer Login

1. Acessa http://localhost:3000
2. Middleware redireciona para /login
3. Digita um dos emails acima
4. Digita a password (admin123, etc)
5. Clica "Entrar"
6. Vê o dashboard com gráficos

## 7. Testar Funcionalidades

### Admin

- Login como admin@example.com
- Acessa /admin/users
- Cria/edita/deleta utilizadores
- Pode atribuir roles

### Manager

- Login como manager@example.com
- Vê produtos, pode criar
- Registar vendas
- Ver relatórios

### Sales Person

- Login como sales@example.com
- Pode registar vendas
- NÃO vê relatórios nem admin

## Estrutura do Projeto

```
/vercel/share/
├── app/
│   ├── page.tsx                 # Dashboard (protegida)
│   ├── login/page.tsx          # Login (pública)
│   ├── products/page.tsx       # Produtos (protegida)
│   ├── sales/page.tsx          # Vendas (protegida)
│   ├── reports/page.tsx        # Relatórios (protegida)
│   ├── admin/users/page.tsx    # Admin (protegida, admin only)
│   └── api/
│       ├── auth/login/
│       ├── auth/logout/
│       ├── admin/users/
│       ├── products/
│       ├── sales/
│       └── reports/
├── components/
│   ├── auth-guard.tsx          # Componente de proteção
│   ├── navbar.tsx              # Navegação
│   ├── products/               # Componentes de produtos
│   ├── sales/                  # Componentes de vendas
│   └── reports/                # Componentes de relatórios
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Schema Drizzle
│   │   └── client.ts           # Cliente Drizzle
│   └── auth.ts                 # Lógica de auth
├── middleware.ts               # Proteção de rotas
├── scripts/
│   ├── seed-admin.ts           # Criar admin users
│   └── seed-drinks.ts          # Criar produtos
└── auth/
```

## Autenticação

### Fluxo de Login

```
1. Utilizador acessa /
2. Middleware verifica token
3. Sem token → redireciona para /login
4. Faz login em /login
5. POST /api/auth/login valida credenciais
6. Token + user salvo em localStorage
7. Redireciona para /
8. AuthGuard valida token
9. Dashboard carrega
```

### Rotas Protegidas

```
/ (dashboard)         → AuthGuard
/products            → AuthGuard
/products/new        → AuthGuard
/products/[id]/edit  → AuthGuard
/sales               → AuthGuard
/reports             → AuthGuard
/admin/users         → AuthGuard + role="admin"
```

### Rotas Públicas

```
/login               → Sem proteção
```

## Comandos Úteis

```bash
# Instalar
pnpm install

# Dev
pnpm dev

# Build
pnpm build

# Start (produção)
pnpm start

# Lint
pnpm lint

# Seed admin
pnpm seed:admin

# Seed drinks
pnpm seed:drinks

# Seed genérico
pnpm seed
```

## Troubleshooting

### "DATABASE_URL not configured"

- Crie `.env.local` com DATABASE_URL
- Reinicie o servidor: `pnpm dev`

### "Utilizador não encontrado ao fazer login"

- Rode `pnpm seed:admin` para criar utilizadores
- Tente com admin@example.com / admin123

### "Redireciona para login indefinidamente"

- Limpe localStorage: F12 → Application → Storage → Clear all
- Faça login novamente

### "Página carrega em branco"

- Verifique o console (F12)
- Procure erros de autenticação
- Verifique se DATABASE_URL está correto

## Documentação

- `AUTENTICACAO_100.md` - Detalhes de autenticação
- `AUTH_SETUP.md` - Setup de auth
- `FINAL_IMPLEMENTATION.md` - Documentação técnica
- `DEPLOYMENT.md` - Deploy em produção
- `QUICK_START.md` - Guia rápido

## Próximos Passos

1. Customizar paleta de cores (se necessário)
2. Adicionar mais funcionalidades
3. Implementar rate limiting
4. Adicionar 2FA
5. Deploy em Vercel

---

**Você está pronto para começar!** 🚀

Qualquer dúvida, consulte os ficheiros de documentação.
