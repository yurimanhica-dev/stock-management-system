# Setup de Autenticação e Admin

## Visão Geral do Sistema

O sistema agora possui um sistema completo de autenticação com três níveis de permissões:

1. **Admin** - Acesso total, gestão de utilizadores
2. **Event Manager** - Gestão de produtos, relatórios
3. **Sales Person** - Apenas registar vendas

## Setup Inicial

### 1. Definir Variáveis de Ambiente

Adicione ao arquivo `.env.local`:

```
DATABASE_URL=sua_url_neon_aqui
```

### 2. Criar Utilizador Admin

Execute o script seed para criar os utilizadores padrão:

```bash
pnpm seed:admin
```

Isto criará 3 utilizadores:
- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **Sales**: sales@example.com / sales123

### 3. Criar Produtos (Bebidas)

Execute o script para popular a BD com bebidas:

```bash
pnpm seed:drinks
```

## Fluxo de Autenticação

### Login
1. Navegue para `http://localhost:3000/login`
2. Introduza email e password
3. Sistema cria sessão por 7 dias
4. Redirecionado para dashboard

### Logout
Clique no botão "Logout" na navbar (canto superior direito)

### Rutas Protegidas
As seguintes rutas requerem autenticação:
- `/` - Dashboard (todos)
- `/products` - Gestão de Produtos (admin + event_manager)
- `/sales` - Registar Vendas (todos)
- `/reports` - Relatórios (admin + event_manager)
- `/admin/users` - Gestão de Utilizadores (admin only)

## Gestão de Utilizadores (Admin)

Apenas utilizadores com role **admin** podem acessar `/admin/users`.

### Criar Novo Utilizador
1. Aceda a `/admin/users`
2. Clique em "Novo Utilizador"
3. Preencha:
   - Nome
   - Email (único)
   - Password
   - Role (Admin, Gestor, Vendedor)
4. Clique "Criar Utilizador"

### Editar Utilizador
1. Aceda a `/admin/users`
2. Localize o utilizador na tabela
3. Clique no botão "Editar"
4. Atualize os dados
5. Clique "Guardar"

### Deletar Utilizador
1. Aceda a `/admin/users`
2. Localize o utilizador
3. Clique no botão "Deletar"
4. Confirme a ação

**Nota**: Não pode deletar a sua própria conta.

## UI/UX Melhorias

### Tema
- **Default**: Light Mode (para conforto visual)
- **Alternância**: Clique no ícone da lua/sol na navbar
- **Suporte**: Dark mode totalmente funcional

### Fonte
- **Principal**: Geist (moderna, limpa, profissional)
- **Mono**: Geist Mono (para código e dados)

### Dashboard
- **Gráficos em Tempo Real**: Vendas por hora com cores distintas
- **Pie Chart**: Top 5 produtos vendidos
- **Bar Chart**: Receita por produto
- **Stats Cards**: Resumo rápido de métricas

### Navbar
- Mostra utilizador autenticado
- Admin pode aceder a `/admin/users` via ícone settings
- Logout simples e rápido

## Credenciais de Demo

Para testar o sistema:

```
Email: admin@example.com
Password: admin123
```

```
Email: manager@example.com
Password: manager123
```

```
Email: sales@example.com
Password: sales123
```

## Segurança

⚠️ **Nota de Desenvolvimento**: 
- Passwords são armazenadas em plaintext (apenas para demo)
- Em produção, use bcrypt ou argon2
- Use HTTPS em produção
- Implemente rate limiting em login

## Troubleshooting

### "Não autenticado" ao acessar rotas protegidas
- Verifique se fez login
- Verifique o token em localStorage
- Faça logout e login novamente

### "Não autorizado" ao acessar admin
- Apenas admins podem acessar `/admin/users`
- Peça a um admin para lhe alterar o role

### Problemas de tema
- Limpe cache do navegador
- Verifique se next-themes está instalado

## Próximas Melhorias

- [ ] Implementar bcrypt para passwords
- [ ] Adicionar 2FA (two-factor authentication)
- [ ] Implementar refresh tokens
- [ ] Adicionar auditoria de login
- [ ] Rate limiting em login
- [ ] Email de recuperação de password
