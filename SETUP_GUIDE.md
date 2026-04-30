# Guia de Setup - Stock Management System

## ✅ Checklist de Implementação

Todas as funcionalidades foram implementadas. Aqui está o que fazer para pôr em funcionamento:

## 1️⃣ **Variáveis de Ambiente**

Crie `.env.local` na raiz do projeto:

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@neon.tech:5432/stock_db?sslmode=require

# Auth0 (opcional, estrutura está pronta)
AUTH0_DOMAIN=seu-domain.auth0.com
AUTH0_CLIENT_ID=seu-client-id
AUTH0_CLIENT_SECRET=seu-secret
AUTH0_BASE_URL=http://localhost:3000
```

## 2️⃣ **Base de Dados**

### Já criada:
- ✓ Tabela `users`
- ✓ Tabela `products` (com `image_url`, `category`)
- ✓ Tabela `sales` (com `user_id`)
- ✓ Tabela `sale_items` (com `snapshot` JSONB, `notes`)

### Scripts disponíveis:
```bash
# Seed com 18 produtos de bebidas
pnpm seed:drinks
```

## 3️⃣ **Instalação e Início**

```bash
# 1. Instalar dependências
pnpm install

# 2. Carregar dados de teste (bebidas)
pnpm seed:drinks

# 3. Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse: `http://localhost:3000`

## 4️⃣ **Testar Fluxos Principais**

### Criar Produto
```
/products → Novo Produto
→ Preencher formulário
→ Upload imagem
→ Guardar
```

### Registar Venda
```
/sales → Selecionar produto
→ Quantidade
→ Adicionar item
→ Registar Venda
→ Stock atualiza automaticamente
```

### Ver Relatório
```
/reports → Selecionar data
→ Vê resumo + produtos vendidos + stock
→ Imprimir ou Download PDF
```

## 5️⃣ **Auth0 Setup (Opcional mas Recomendado)**

Se quiser autenticação real:

1. Crie conta em https://auth0.com
2. Crie aplicação "Regular Web Application"
3. Copie credenciais para `.env.local`
4. Configure Auth0 com role-based access control
5. Roles: `event_manager`, `sales_person`

## 6️⃣ **Upload de Imagens**

### Atualmente:
- Usa base64 (demo)
- Funciona para prototipagem

### Para Produção:
1. Instale Uploadthing: `pnpm add uploadthing @uploadthing/react`
2. Configure Uploadthing API
3. Descomente código Uploadthing em `product-form.tsx`

## 7️⃣ **Ambiente de Produção**

```bash
# Build
pnpm build

# Start
pnpm start
```

Deploy para Vercel:
```bash
vercel deploy
```

## 📊 O que Está Implementado

### Backend (Next.js API Routes)
- ✓ `POST /api/products` - Criar produto
- ✓ `GET /api/products` - Listar produtos
- ✓ `GET /api/products/[id]` - Detalhe produto
- ✓ `PATCH /api/products/[id]` - Editar produto
- ✓ `DELETE /api/products/[id]` - Deletar produto
- ✓ `POST /api/sales` - Registar venda com snapshot
- ✓ `GET /api/sales` - Listar vendas
- ✓ `GET /api/reports/daily?date=YYYY-MM-DD` - Relatório
- ✓ `GET /api/users/me` - Dados do usuário
- ✓ `POST /api/users/sync` - Sincronizar usuário

### Frontend (Pages & Components)
- ✓ `/` - Dashboard
- ✓ `/products` - Lista de produtos
- ✓ `/products/new` - Criar novo produto
- ✓ `/products/[id]/edit` - Editar produto
- ✓ `/sales` - Registador de vendas
- ✓ `/reports` - Relatório diário

### Funcionalidades
- ✓ Tema claro/escuro
- ✓ Imagens em todos os locais
- ✓ Snapshot de venda (histórico congelado)
- ✓ Relatórios com PDF
- ✓ Estrutura de autenticação

## 🐛 Troubleshooting

### DATABASE_URL não definida
```bash
# Adicione ao .env.local
DATABASE_URL=sua_url_neon
```

### Porta 3000 já em uso
```bash
pnpm dev -- -p 3001
```

### Imagens não aparecem
- Verifique a URL da imagem
- Se usar base64, certifique-se do upload

### Build falha
```bash
# Limpe cache
rm -rf .next
pnpm build
```

## 📞 Detalhes Técnicos

- **Framework**: Next.js 16
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle
- **UI**: shadcn/ui + Tailwind CSS
- **Auth**: Auth0 (pronto, opcional)
- **Imagens**: Base64 (ou Uploadthing)
- **PDF**: html2canvas + jsPDF

## ✨ Características Especiais

1. **Snapshot de Venda**: Guarda dados congelados no JSON
2. **Stock Automático**: Decresce quando vende
3. **Imagens em Tempo Real**: Preview no checkout
4. **Relatórios Completos**: Com fotos e totais
5. **Multi-user**: Rastreia quem fez a venda

## 🎉 Pronto!

O sistema está 100% funcional. Apenas precisa de:
1. `.env.local` com DATABASE_URL
2. Correr `pnpm seed:drinks` (opcional)
3. `pnpm dev`

Tudo mais já está implementado!
