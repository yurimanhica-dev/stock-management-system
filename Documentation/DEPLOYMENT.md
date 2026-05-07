# Guia de Deployment

## 🚀 Deploy para Produção

### 1. Deploy no Vercel (Recomendado)

#### Pré-requisitos
- GitHub account
- Neon database criada
- Vercel account

#### Passos

1. **Push para GitHub**
```bash
git remote add origin https://github.com/seu-usuario/seu-repo.git
git branch -M main
git push -u origin main
```

2. **Conectar no Vercel**
   - Vá para https://vercel.com/new
   - Selecione seu repositório
   - Configure as variáveis de ambiente

3. **Variáveis de Ambiente**
   - `DATABASE_URL` - String de conexão Neon

4. **Deploy**
   - Vercel fará o build e deploy automaticamente

### 2. Deploy Manual

#### Localmente
```bash
# 1. Instalar dependências
pnpm install

# 2. Build
pnpm build

# 3. Start
pnpm start
```

#### VPS/Servidor próprio
```bash
# 1. Clone o repositório
git clone seu-repo
cd seu-repo

# 2. Instale Node.js 18+
# Use nvm ou seu gerenciador

# 3. Instale dependências
pnpm install

# 4. Configure variáveis
echo "DATABASE_URL=..." > .env.local

# 5. Setup do database
pnpm seed:admin
pnpm seed:drinks

# 6. Build
pnpm build

# 7. Use PM2 ou similar para rodar
pm2 start npm --name "stock-manager" -- start
```

---

## 📋 Checklist Pré-Deployment

- [ ] DATABASE_URL configurada
- [ ] Admin user criado (seed:admin)
- [ ] Produtos criados (seed:drinks)
- [ ] HTTPS ativado
- [ ] Variáveis de ambiente configuradas
- [ ] Build testado localmente
- [ ] Tests passam
- [ ] Logs configurados
- [ ] Backup strategy definida

---

## 🔒 Segurança para Produção

### 1. Passwords (Obrigatório)
Implemente bcrypt antes de ir para produção:

```typescript
import bcrypt from 'bcrypt'

// Ao criar utilizador
const hashedPassword = await bcrypt.hash(password, 10)

// Ao fazer login
const isValid = await bcrypt.compare(password, user.password)
```

### 2. HTTPS
- Obrigatório em produção
- Use certificado SSL/TLS
- Redirecione HTTP → HTTPS

### 3. Rate Limiting
```typescript
// Implementar em /api/auth/login
// Máximo 5 tentativas por IP, por 15 minutos
```

### 4. CORS
Configure CORS para seu domínio específico

### 5. Secrets
- Nunca commit `.env.local`
- Use `.env.example` para documentar
- Regenere session tokens regularmente

### 6. Sessions
- Aumentar duração em produção (atualmente 7 dias)
- Implementar refresh tokens
- Validar sessão em cada request

---

## 📊 Monitoramento

### Logs
Use um serviço como:
- Vercel Analytics (incluído)
- LogRocket
- Datadog
- Sentry (erros)

### Performance
- Monitorar latência de queries
- Cache de relatórios
- CDN para imagens
- Compressão de assets

### Uptime
- Monitorar uptime (UptimeRobot)
- Alertas de erro
- Health checks

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Exemplo)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test (se tiver)
      
      - name: Deploy
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🗄️ Backup Strategy

### Database
```bash
# Backup diário do Neon
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Ou use o painel do Neon
# Dashboard > Backups
```

### Ficheiros
- Imagens em CDN ou cloud storage
- Código no GitHub
- Config em variáveis de ambiente

---

## 🆘 Troubleshooting

### Erro "Database connection failed"
1. Verificar DATABASE_URL
2. Verificar IP whitelist do Neon
3. Testar conexão com psql

### Páginas brancas
1. Verificar logs do servidor
2. Verificar console do navegador
3. Verificar Sentry/LogRocket

### Performance lenta
1. Verificar queries com EXPLAIN
2. Adicionar índices se necessário
3. Implementar caching
4. Usar CDN para assets estáticos

---

## 📈 Scaling

### Para 10k+ usuários
1. Implementar rate limiting
2. Usar Redis para sessions
3. Implementar caching de relatórios
4. Separar read/write databases
5. Implementar queue (Bull, RabbitMQ)

### Database
```sql
-- Aumentar recursos Neon
-- Ou migrar para AWS RDS
```

---

## 🎯 Performance Targets

- **First Paint**: < 1s
- **Time to Interactive**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **API Response**: < 200ms
- **Database Query**: < 100ms

---

## 📞 Suporte & SLA

Para ambiente de produção considere:
- SLA de uptime (99.9%)
- Support 24/7
- Incident response plan
- Disaster recovery plan

---

## Próximas Etapas

1. [ ] Implementar bcrypt
2. [ ] Configurar HTTPS
3. [ ] Setup de monitoring
4. [ ] Setup de backup automático
5. [ ] Configure rate limiting
6. [ ] Implementar refresh tokens
7. [ ] Setup CI/CD
8. [ ] Load testing
9. [ ] Security audit
10. [ ] Performance optimization

---

**Pronto para produção!** 🎉
