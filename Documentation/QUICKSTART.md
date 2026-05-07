# Guia Rápido - Stock Manager 🚀

## Primeiros Passos

### 1. Começar o Servidor
```bash
pnpm dev
```
Acesse: `http://localhost:3000`

### 2. Adicionar Dados de Exemplo (Opcional)
```bash
pnpm seed
```
Isto adiciona 6 produtos de exemplo e 1 venda.

## Uso Rápido

### 📦 Gestão de Produtos
**URL**: http://localhost:3000/products

1. Clique em "Novo Produto"
2. Preencha os dados:
   - Nome: ex. "Laptop Dell"
   - SKU: ex. "DELL-001" (identificador único)
   - Descrição: (opcional)
   - Preço: ex. 999.99
   - Stock: ex. 5
3. Clique "Criar"

**Editar/Deletar**: Use os botões ao lado de cada produto

---

### 💰 Registar Vendas
**URL**: http://localhost:3000/sales

1. Selecione um produto do dropdown
2. Digite a quantidade
3. Clique "Adicionar"
4. Repita para múltiplos produtos
5. Adicione notas (opcional)
6. Clique "Registar Venda"

✅ O stock será atualizado automaticamente!

---

### 📊 Relatórios Diários
**URL**: http://localhost:3000/reports

1. Selecione uma data com o datepicker
2. Visualize:
   - **Total de Vendas**: Quantidade de transações
   - **Receita Total**: Valor total vendido
   - **Produtos Vendidos**: Lista de itens com valores
   - **Stock Atual**: Todos os produtos e quantidades

**Imprimir**: Clique "Imprimir" para usar o print do navegador
**PDF**: Clique "Descarregar PDF" para salvar arquivo

---

## Temas

### Alternar Tema
Clique no ícone do sol/lua na navbar para alternar entre modo claro e escuro.

---

## Estrutura de Dados

### Um Produto tem:
- Nome
- SKU (identificador único)
- Descrição
- Preço unitário
- Quantidade em stock

### Uma Venda tem:
- Data/Hora
- Múltiplos itens (produto + quantidade + preço)
- Total de vendas (calculado automaticamente)
- Notas opcionais

### Quando registar uma venda:
✓ O stock do produto diminui
✓ O total é calculado automaticamente
✓ Dados são salvos na base de dados

---

## Atalhos Úteis

| Ação | Aatalho |
|------|---------|
| Página Inicial | / |
| Produtos | /products |
| Vendas | /sales |
| Relatórios | /reports |

---

## Erros Comuns & Soluções

### ❌ "Quantidade em stock insuficiente"
- O produto não tem stock suficiente
- Adicione mais stock na página de Produtos
- Ou crie um novo produto com mais stock

### ❌ "DATABASE_URL is not set"
- Verifique o arquivo `.env.local`
- Copie a URL de conexão do Neon
- Reinicie com `pnpm dev`

### ❌ Produtos não aparecem no dropdown de vendas
- Produtos com stock 0 não aparecem
- Aumente o stock na página de Produtos
- Recarregue a página de vendas

---

## Dicas Pro 💡

1. **Use SKUs únicos e descritivos**
   - Bom: `LAPTOP-DELL-XPS-001`
   - Ruim: `P1`

2. **Registre vendas imediatamente**
   - Assim o stock fica sempre atualizado
   - Facilita reconciliação posterior

3. **Verifique relatórios antes de fechar**
   - Confira dados no fim do dia
   - Exporte em PDF para arquivo

4. **Aproveite o modo escuro**
   - Melhor para os olhos em ambientes com pouca luz
   - Tema automático segue preferência do sistema

---

## Suporte

Para dúvidas:
1. Verifique o README.md para documentação completa
2. Cheque o arquivo package.json para scripts disponíveis
3. Veja os logs do navegador (F12) para erros

---

**Sistema de Gestão de Stock - Versão 1.0** 
Desenvolvido com Next.js + PostgreSQL + Drizzle ORM
