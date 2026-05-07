# Quick Start - 5 Minutos

## 1. Setup (2 min)

```bash
# Instale dependências
pnpm install

# Configure a base de dados no .env.local
# DATABASE_URL=postgresql://...
```

## 2. Criar Admin (1 min)

```bash
# Cria utilizador admin
pnpm seed:admin

# Output:
# admin@example.com / admin123
# manager@example.com / manager123
# sales@example.com / sales123
```

## 3. Criar Produtos (30 seg)

```bash
# Cria 18 bebidas de demo
pnpm seed:drinks
```

## 4. Iniciar (1 min)

```bash
# Start dev server
pnpm dev

# Acesse: http://localhost:3000/login
```

## 5. Login

```
Email: admin@example.com
Password: admin123
```

---

## 🎯 O Que Fazer Após Login

### Para Admin
1. Clique no ícone de settings (engrenagem) na navbar
2. Vá para `/admin/users`
3. Crie novos utilizadores com roles diferentes

### Para Todos
1. Explore o **Dashboard** (gráficos de vendas)
2. Vá a **Vendas** e registre uma venda
3. Veja o **Stock** atualizado automaticamente
4. Confira os **Relatórios** diários

### Alternância de Tema
- Clique no ícone da lua/sol na navbar
- Alterna entre light (padrão) e dark mode

---

## 📁 Ficheiros Importantes

| Path | Descrição |
|------|-----------|
| `/login` | Página de login |
| `/` | Dashboard com gráficos |
| `/admin/users` | Gestão de users (admin only) |
| `/products` | Listagem e criação de produtos |
| `/sales` | Registador de vendas |
| `/reports` | Relatórios diários |

---

## 🆘 Troubleshooting Rápido

### "Erro de conexão à BD"
```bash
# Verifique .env.local
echo $DATABASE_URL

# Ou crie um novo arquivo
echo "DATABASE_URL=sua_url_aqui" > .env.local
```

### "Página branca ao fazer login"
1. Abra DevTools (F12)
2. Console tab - verifique erros
3. Reinicie o dev server

### "Seed não funciona"
```bash
# Certifique-se que DATABASE_URL está definida
# Depois execute novamente
pnpm seed:admin
```

---

## 💡 Dicas

- **Login rápido**: Use a credencial de demo (admin123)
- **Tema preferido**: Light mode é o padrão
- **Explorar**: Todos os gráficos têm hover interativo
- **Imagens**: Use URLs de imagens públicas
- **Relatórios**: Botão de print funciona no navegador

---

## 🔐 Senhas Diferentes

Para testar diferentes níveis de acesso:

```
Admin (acesso total):
  admin@example.com / admin123

Manager (gestão de produtos + relatórios):
  manager@example.com / manager123

Sales Person (apenas vendas):
  sales@example.com / sales123
```

---

## 📈 Dados de Demo

O sistema inclui:
- 18 produtos bebidas pré-carregados
- Gráficos de vendas por hora
- 5 produtos top com cores distintas
- Stats calculadas automaticamente

---

## 🎮 Experimentar

1. **Registar venda**: Vá a `/sales`, selecione produto, venda 5 unidades
2. **Ver stock**: Volte a `/products`, veja stock decrementado
3. **Relatório**: Vá a `/reports`, veja a venda registada
4. **Admin**: Vá a `/admin/users`, crie novo utilizador

---

## ✅ Ready to Go!

Você tem tudo pronto para:
- ✅ Usar em desenvolvimento local
- ✅ Testar a funcionalidade
- ✅ Customizar conforme necessário
- ✅ Deploy em produção

---

## 📞 Precisa de Ajuda?

Consulte:
- `AUTH_SETUP.md` - Autenticação em detalhe
- `FINAL_IMPLEMENTATION.md` - Documentação técnica
- `DEPLOYMENT.md` - Como fazer deploy

---

**Bom uso! 🚀**
