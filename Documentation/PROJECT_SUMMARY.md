# 📦 Sistema de Gestão de Stock - Resumo do Projeto

## O que foi construído

Um **sistema profissional e completo** de gestão de stock que permite:

✅ **Gerir Produtos** - Criar, editar, deletar produtos com SKU, preço e stock
✅ **Registar Vendas** - Interface intuitiva para registar vendas com múltiplos itens
✅ **Atualizar Stock Automaticamente** - Stock é decrementado após cada venda
✅ **Gerar Relatórios Diários** - Visualizar vendas, produtos vendidos, stock e receitas
✅ **Imprimir e Exportar PDF** - Relatórios podem ser impressos ou salvos em PDF
✅ **Tema Claro/Escuro** - Interface responsiva com suporte a ambos os temas
✅ **Base de Dados Robusta** - PostgreSQL com Drizzle ORM para máxima segurança

---

## Arquitetura

### Backend
- **Next.js 16** - Framework React com Server Components
- **PostgreSQL (Neon)** - Banco de dados serverless
- **Drizzle ORM** - Query builder type-safe
- **Route Handlers** - API REST para todas as operações

### Frontend  
- **React 19** - Framework UI moderno
- **TypeScript** - Type safety garantido
- **shadcn/ui** - Componentes acessíveis e bonitos
- **Tailwind CSS 4** - Estilo responsivo
- **next-themes** - Gerenciamento de tema claro/escuro

### Banco de Dados
```
products       → Catálogo de produtos com preço e stock
sales          → Transações de vendas
sale_items     → Itens detalhados de cada venda
```

---

## Funcionalidades Implementadas

### 1. Dashboard Principal (`/`)
- Visão geral do sistema
- Cards com features principais
- Links rápidos para todas as seções
- Informações sobre tecnologia usada

### 2. Gestão de Produtos (`/products`)
- Tabela com todos os produtos
- Status do stock (com cores)
- Botão "Novo Produto" com formulário modal
- Editar produtos inline
- Deletar com confirmação
- Validação de SKU único

### 3. Registador de Vendas (`/sales`)
- Dropdown para selecionar produtos
- Campo de quantidade
- Validação automática de stock disponível
- Tabela com itens selecionados
- Total calculado automaticamente
- Remover itens da venda
- Notas opcionais
- Botão para registar venda (com confirmação)

### 4. Relatórios Diários (`/reports`)
- Selecionador de data
- **Cards de resumo:**
  - Total de vendas do dia
  - Receita total
  - Número de produtos vendidos
- **Tabela de produtos vendidos:**
  - Nome do produto
  - Quantidade vendida
  - Valor total por produto
- **Tabela de stock atual:**
  - Todos os produtos
  - SKU
  - Quantidade disponível
  - Preço unitário
  - Valor total do stock
- **Botões de ação:**
  - Imprimir página (via navegador)
  - Descarregar PDF (automático)

### 5. Navegação (`/components/navbar.tsx`)
- Logo com branding
- Links para todas as páginas
- Botão de alteração de tema
- Responsivo para mobile

---

## API Endpoints

### Produtos
```
GET    /api/products           → Lista todos os produtos
POST   /api/products           → Cria novo produto
GET    /api/products/[id]      → Obtém produto específico
PUT    /api/products/[id]      → Atualiza produto
DELETE /api/products/[id]      → Deleta produto
```

### Vendas
```
GET    /api/sales              → Lista todas as vendas
POST   /api/sales              → Registra nova venda
                                 (+ atualiza stock)
```

### Relatórios
```
GET    /api/reports/daily?date=YYYY-MM-DD
       → Gera relatório do dia específico
```

---

## Paleta de Cores (Purple Theme)

### Light Mode
```
Background:    #fafafa (almost white)
Foreground:    #1e0a3d (dark purple)
Primary:       #7c3aed (purple vibrant)
Secondary:     #e9e5ff (light purple)
Accent:        #a78bfa (purple lighter)
Border:        #e9d5ff (purple edge)
```

### Dark Mode
```
Background:    #1e0a3d (dark purple)
Foreground:    #f3f4f6 (light gray)
Primary:       #a78bfa (purple bright)
Secondary:     #401f7f (dark purple)
Accent:        #c4b5fd (purple light)
Border:        #401f7f (purple edge)
```

---

## Schema do Banco de Dados

### Tabela: products
```sql
id           SERIAL PRIMARY KEY
name         VARCHAR(255) NOT NULL
sku          VARCHAR(100) NOT NULL UNIQUE
description  TEXT
unit_price   DECIMAL(10,2) NOT NULL
stock_quantity INTEGER NOT NULL DEFAULT 0
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()

INDEXES: idx_sku (sku)
```

### Tabela: sales
```sql
id          SERIAL PRIMARY KEY
sale_date   TIMESTAMP DEFAULT NOW()
total_amount DECIMAL(12,2) NOT NULL
notes       TEXT
created_at  TIMESTAMP DEFAULT NOW()

INDEXES: idx_sales_date (sale_date)
```

### Tabela: sale_items
```sql
id          SERIAL PRIMARY KEY
sale_id     INTEGER NOT NULL FK → sales(id) CASCADE
product_id  INTEGER NOT NULL FK → products(id)
quantity    INTEGER NOT NULL
unit_price  DECIMAL(10,2) NOT NULL
subtotal    DECIMAL(12,2) NOT NULL
created_at  TIMESTAMP DEFAULT NOW()

INDEXES: idx_sale_items_sale_id, idx_sale_items_product_id
```

---

## Fluxo de Dados

### Registar Venda
```
1. Selecionar produto → Dropdown mostra apenas produtos com stock > 0
2. Definir quantidade → Validação de quantidade disponível
3. Clicar "Adicionar" → Item adicionado à tabela
4. Repetir para múltiplos itens
5. Clicar "Registar Venda" → 
   a. Criar registro em tabela "sales"
   b. Criar registros em "sale_items"
   c. Decrementar stock em "products"
   d. Mostrar confirmação de sucesso
```

### Gerar Relatório
```
1. Selecionar data
2. Query busca todas as vendas desse dia
3. Agregação de dados por produto
4. Busca stock atual de todos os produtos
5. Renderizar tabelas com dados
6. Opção de imprimir ou exportar PDF
```

---

## Segurança & Performance

### Segurança ✅
- Drizzle ORM previne SQL injection
- Validação de entrada no backend
- Transações de banco de dados para integridade
- Tratamento robusto de erros
- Validação de stock antes de venda

### Performance ⚡
- Build otimizado com Turbopack (Next.js 16)
- Índices em campos frequently queried
- Lazy loading de componentes
- Cache automático via Next.js
- Queries otimizadas com Drizzle

---

## Arquivos Principais

```
app/
├── api/
│   ├── products/route.ts       (CRUD de produtos)
│   ├── products/[id]/route.ts  (Operações por ID)
│   ├── sales/route.ts           (Registar vendas)
│   └── reports/daily/route.ts  (Gerar relatórios)
├── products/page.tsx            (Página de produtos)
├── sales/page.tsx               (Página de vendas)
├── reports/page.tsx             (Página de relatórios)
├── layout.tsx                   (Layout raiz)
├── page.tsx                     (Dashboard)
└── globals.css                  (Estilos & cores)

components/
├── products/product-list.tsx     (Tabela + formulário)
├── sales/sales-recorder.tsx      (Registador de vendas)
├── reports/daily-report.tsx      (Relatório completo)
├── navbar.tsx                    (Navegação)
└── theme-provider.tsx            (Provider de tema)

lib/db/
├── client.ts                     (Cliente Drizzle)
└── schema.ts                     (Definição de tabelas)

scripts/
└── seed.ts                       (Dados de exemplo)
```

---

## Tecnologias Usadas

| Aspecto | Tecnologia |
|--------|-----------|
| **Frontend Framework** | Next.js 16 |
| **React Version** | React 19 |
| **Linguagem** | TypeScript 5.7 |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM 0.45 |
| **UI Components** | shadcn/ui |
| **CSS Framework** | Tailwind CSS 4 |
| **Tema** | next-themes |
| **PDF Export** | jsPDF + html2canvas |
| **Icons** | Lucide React |

---

## Como Usar

### Instalação
```bash
pnpm install
```

### Desenvolvimento
```bash
pnpm dev
# Acesse http://localhost:3000
```

### Seed de Dados
```bash
pnpm seed
# Adiciona 6 produtos e 1 venda de exemplo
```

### Build de Produção
```bash
pnpm build
pnpm start
```

---

## Variáveis de Ambiente

Crie `.env.local`:
```
DATABASE_URL=postgresql://user:password@host/database
```

---

## Próximos Passos (Melhorias Futuras)

- [ ] Autenticação de usuários
- [ ] Controle de permissões (admin/staff)
- [ ] Histórico de alterações
- [ ] Gráficos de vendas (trending)
- [ ] Notificações de stock baixo
- [ ] Categorias de produtos
- [ ] Múltiplas moedas
- [ ] Integração com sistemas de pagamento
- [ ] API pública para integrações
- [ ] Mobile app nativa

---

## Documentação

- **README.md** - Documentação completa
- **QUICKSTART.md** - Guia rápido de uso
- **PROJECT_SUMMARY.md** - Este arquivo

---

## Autor & Suporte

Sistema desenvolvido com Next.js + PostgreSQL + Drizzle ORM

Para dúvidas ou issues, consulte a documentação ou revise os logs do navegador.

---

**✅ Projeto Completo e Pronto para Uso**
**🚀 Demonstração ao vivo em http://localhost:3000**
