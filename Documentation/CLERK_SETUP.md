# Clerk Authentication Setup

Este projeto agora usa **Clerk** para autenticação com suporte a **Google OAuth**.

## Passo 1: Criar conta no Clerk

1. Acesse [clerk.com](https://clerk.com)
2. Clique em "Sign Up"
3. Complete o registro e faça login

## Passo 2: Criar uma aplicação

1. No dashboard do Clerk, clique em "Create application"
2. Nomeie sua aplicação (ex: "Stock Manager")
3. Selecione "Next.js" como framework
4. Clique em "Create app"

## Passo 3: Copiar as chaves

1. No dashboard, copie as chaves:
   - **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - **CLERK_SECRET_KEY**

2. Adicione ao seu `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Passo 4: Configurar Google OAuth

### No Clerk Dashboard:

1. Acesse **Settings** > **Social connections**
2. Clique em **Google**
3. Copie o "Redirect URI" mostrado
4. Clique em "Configure"

### No Google Cloud Console:

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto (ou selecione um existente)
3. Ative a API "Google+ API"
4. Vá para **Credentials** > **Create OAuth 2.0 Client ID**
5. Selecione "Web application"
6. Em "Authorized redirect URIs", adicione o URI do Clerk
7. Clique em "Create"
8. Copie o **Client ID** e **Client Secret**

### Volta ao Clerk Dashboard:

1. Cole o Client ID e Client Secret
2. Clique em "Save"
3. Ative a conexão (toggle "Enabled")

## Passo 5: Testar

```bash
pnpm dev
```

Acesse `http://localhost:3000/sign-in` e veja as opções de login!

## Funcionalidades do Clerk Implementadas

✓ Login com Email/Password  
✓ Login com Google OAuth  
✓ Sign Up (Criar conta)  
✓ Sign Out  
✓ UserButton (Avatar + Menu)  
✓ Middleware de proteção  
✓ useAuth() hook  
✓ useUser() hook  

## Estrutura de Autenticação

```
app/
├── sign-in/[[...sign-in]]/page.tsx  → Página de login (Clerk)
├── sign-up/[[...sign-up]]/page.tsx  → Página de registro (Clerk)
├── layout.tsx                       → ClerkProvider envolvendo app
└── middleware.ts                    → Proteção de rotas com Clerk

components/
├── navbar.tsx                       → UserButton do Clerk
└── auth-guard.tsx                   → Proteção de componentes
```

## Variáveis de Ambiente

```env
# Obrigatórias
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# URLs (opcional - valores padrão abaixo)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Banco de Dados
DATABASE_URL=
```

## Melhorias com Clerk

- ✅ Autenticação robusta e segura
- ✅ Google OAuth nativo
- ✅ Email verificado automaticamente
- ✅ Perfis de utilizador geridos pelo Clerk
- ✅ Sem necessidade de BC rypt/password hash manual
- ✅ Sessões automáticas
- ✅ UserButton com avatar do Google
- ✅ Sign Up e Sign In nas rotas /sign-up e /sign-in

## Próximos Passos

1. Configurar roles de utilizador (admin, manager, sales) usando Metadata do Clerk
2. Sincronizar dados do Clerk com BD PostgreSQL
3. Implementar controle de acesso baseado em roles

