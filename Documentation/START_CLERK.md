# Começar com Clerk - Guia Rápido

## 1️⃣ Setup no Clerk (5 minutos)

### Opção A: Novo no Clerk
```
1. Acesse https://clerk.com
2. Clique "Sign Up"
3. Complete o registro
4. Crie uma aplicação
5. Copie as chaves
```

### Opção B: Clerk Já Configurado
```
1. Acesse seu dashboard no Clerk
2. Copie as chaves (Settings → API Keys)
```

## 2️⃣ Configurar Google OAuth (5 minutos)

### No Clerk Dashboard:
1. Settings → Social connections → Google
2. Copie o "Redirect URI"

### No Google Cloud Console:
1. Acesse console.cloud.google.com
2. Create Project
3. Enable Google+ API
4. Create OAuth 2.0 Credentials
5. Add the Redirect URI from Clerk
6. Copy Client ID and Secret

### Volta ao Clerk:
1. Paste Client ID and Secret
2. Save
3. Enable the connection

## 3️⃣ Configurar Variáveis (2 minutos)

Crie `.env.local` na raiz do projeto:

```env
# Clerk (da dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Database (seu Neon/PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database

# URLs (deixar como está)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 4️⃣ Rodar (1 minuto)

```bash
# Instalar dependências (já feito)
pnpm install

# Rodar dev server
pnpm dev
```

## 5️⃣ Testar (2 minutos)

1. Abra http://localhost:3000
2. Clique em Login (ou acesse /sign-in)
3. Escolha: Email + Password ou Google
4. Faça login
5. Veja o dashboard!

## 🎉 Pronto!

Seu projeto agora tem:
- ✅ Autenticação segura
- ✅ Login com Google
- ✅ Sessões automáticas
- ✅ Avatar do utilizador
- ✅ Logout fácil
- ✅ Proteção de rotas

## 🔧 Troubleshooting

**Erro: "Clerk is not configured"**
- Verify .env.local tem NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- Restart dev server: `Ctrl+C` then `pnpm dev`

**Google OAuth não aparece**
- Verify no Clerk Dashboard que Google está "Enabled"
- Check se o Client ID/Secret estão corretos

**"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set"**
- Verify .env.local exists e está no root do projeto
- Não esqueça `NEXT_PUBLIC_` no início da variável

## 📖 Próximos Passos

1. Implementar roles (admin, manager, sales)
2. Sincronizar usuários com BD
3. Adicionar Metadata do Clerk para roles
4. Deploy no Vercel

## 🚀 Deploy no Vercel

1. Push para GitHub
2. Connect projeto no Vercel
3. Adicione variáveis de ambiente no Vercel Settings
4. Deploy automático!

---

**Documentação completa**: Ver `CLERK_SETUP.md`

**Dúvidas?**: https://clerk.com/docs
