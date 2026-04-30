# Sistema de Gestão de Stock 📦

Um sistema profissional e moderno de gestão de stock, vendas e relatórios diários. Desenvolvido com tecnologias modernas para garantir performance, segurança e usabilidade.

## Características Principais ✨

✅ **Gestão de Produtos** - Crie, edite e delete produtos com SKU único, preço e quantidade de stock
✅ **Registar Vendas** - Interface intuitiva para registar vendas com múltiplos itens
✅ **Atualização Automática de Stock** - O stock é atualizado automaticamente após cada venda
✅ **Relatórios Diários Completos** - Visualize vendas, produtos vendidos, stock atual e receitas
✅ **Impressão e PDF** - Imprima ou exporte relatórios em PDF
✅ **Tema Claro/Escuro** - Interface responsiva com suporte a tema escuro
✅ **Autenticação Segura** - Sistema robusto e seguro para acesso aos dados

## Tecnologia 🛠️

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Banco de Dados**: PostgreSQL via Neon com Drizzle ORM
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4
- **Exportação**: jsPDF + html2canvas para PDF
- **Tema**: next-themes para light/dark mode

## Instalação 📥

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)
- Conta Neon para PostgreSQL

### Passos

1. **Clone e instale dependências**
   ```bash
   pnpm install
   ```

2. **Configure variáveis de ambiente**
   Crie um arquivo `.env.local` com:
   ```
   DATABASE_URL=sua_conexao_neon_postgres
   ```

3. **Execute o seed (opcional)**
   Para adicionar dados de exemplo:
   ```bash
   pnpm seed
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm dev
   ```

   A aplicação estará disponível em `http://localhost:3000`

## Uso 🚀

### Dashboard
- Acesse a página inicial para visão geral do sistema
- Links rápidos para todas as funcionalidades principais

### Gestão de Produtos
- **Ir para**: `/products`
- Crie novos produtos com nome, SKU, descrição, preço e quantidade
- Edite produtos existentes
- Delete produtos quando necessário

### Registar Vendas
- **Ir para**: `/sales`
- Selecione produtos do catálogo
- Defina as quantidades
- O sistema valida se há stock suficiente
- Registre a venda para atualizar automaticamente o stock

### Relatórios Diários
- **Ir para**: `/reports`
- Selecione uma data para visualizar o relatório
- Veja:
  - Total de vendas do dia
  - Receita total
  - Produtos vendidos e valores
  - Stock atual de todos os produtos
- **Imprima** a página pelo navegador
- **Exporte em PDF** para arquivo

## Estrutura do Projeto 📂

```
.
├── app/
│   ├── api/                    # Route handlers da API
│   │   ├── products/          # CRUD de produtos
│   │   ├── sales/             # Registar vendas
│   │   └── reports/           # Gerar relatórios
│   ├── products/              # Página de produtos
│   ├── sales/                 # Página de vendas
│   ├── reports/               # Página de relatórios
│   ├── layout.tsx             # Layout raiz
│   ├── page.tsx               # Dashboard
│   └── globals.css            # Estilos globais
├── components/
│   ├── products/              # Componentes de produtos
│   ├── sales/                 # Componentes de vendas
│   ├── reports/               # Componentes de relatórios
│   ├── navbar.tsx             # Navegação
│   └── theme-provider.tsx     # Provider de tema
├── lib/
│   └── db/
│       ├── client.ts          # Cliente Drizzle ORM
│       └── schema.ts          # Definição de tabelas
├── scripts/
│   └── seed.ts                # Script de dados de exemplo
└── public/                    # Arquivos estáticos
```

## API Endpoints 🔌

### Produtos
- `GET /api/products` - Listar todos os produtos
- `POST /api/products` - Criar novo produto
- `GET /api/products/[id]` - Obter produto específico
- `PUT /api/products/[id]` - Atualizar produto
- `DELETE /api/products/[id]` - Deletar produto

### Vendas
- `GET /api/sales` - Listar todas as vendas
- `POST /api/sales` - Registar nova venda (atualiza stock)

### Relatórios
- `GET /api/reports/daily?date=YYYY-MM-DD` - Obter relatório do dia

## Schema do Banco de Dados 🗄️

### Tabela: products
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR 255)
- sku (VARCHAR 100 UNIQUE)
- description (TEXT)
- unit_price (DECIMAL 10,2)
- stock_quantity (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela: sales
```sql
- id (SERIAL PRIMARY KEY)
- sale_date (TIMESTAMP)
- total_amount (DECIMAL 12,2)
- notes (TEXT)
- created_at (TIMESTAMP)
```

### Tabela: sale_items
```sql
- id (SERIAL PRIMARY KEY)
- sale_id (INTEGER FOREIGN KEY)
- product_id (INTEGER FOREIGN KEY)
- quantity (INTEGER)
- unit_price (DECIMAL 10,2)
- subtotal (DECIMAL 12,2)
- created_at (TIMESTAMP)
```

## Paleta de Cores 🎨

O sistema usa uma paleta **Purple** com suporte a tema claro e escuro:

- **Primary**: Purple (#7c3aed / #a78bfa)
- **Secondary**: Gray variations
- **Accent**: Purple lighter tones
- **Destructive**: Red para ações perigosas

## Funcionalidades Seguras 🔒

- ✅ Validação de entrada no backend
- ✅ Transações de banco de dados para integridade
- ✅ Prevenção de SQL injection com Drizzle ORM
- ✅ Tratamento robusto de erros
- ✅ Validação de stock antes de vendas

## Performance ⚡

- **Build otimizado**: Next.js com SSR/SSG
- **Banco de dados**: Índices em foreign keys e datas
- **Cache**: Validação de cliente para UX rápida
- **Lazy loading**: Componentes carregados sob demanda

## Deployar 🚀

### Vercel (Recomendado)

1. Push seu código para GitHub
2. Conecte seu repositório no Vercel
3. Adicione a variável `DATABASE_URL`
4. Deploy automático

### Docker

```bash
docker build -t stock-manager .
docker run -e DATABASE_URL=sua_conexao -p 3000:3000 stock-manager
```

## Troubleshooting 🔧

### "DATABASE_URL is not set"
- Verifique se a variável está no `.env.local`
- Reinicie o servidor: `pnpm dev`

### Erros ao registar vendas
- Confirme se há stock suficiente
- Verifique se o produto está ativo no banco
- Veja os logs do navegador (F12)

### Problema ao gerar PDF
- Certifique-se de que o navegador permite popoups
- Tente novamente com outra página aberta
- Verifique a consola para erros

## Suporte & Contribuições 💬

Para dúvidas ou sugestões, abra uma issue no repositório.

## Licença 📄

Projeto desenvolvido para gestão profissional de stock.

---

**Desenvolvido com ❤️ usando Next.js, PostgreSQL e Drizzle ORM**
