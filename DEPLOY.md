# 🚀 Guia de Deploy para Produção

## 📋 Checklist Pré-Deploy

### Segurança
- [ ] Trocar JWT_SECRET por valor forte e único
- [ ] Configurar CORS apenas para domínio de produção
- [ ] Adicionar rate limiting
- [ ] Configurar HTTPS
- [ ] Validar todas as entradas de usuário
- [ ] Adicionar helmet.js para segurança HTTP

### Performance
- [ ] Adicionar compressão gzip
- [ ] Configurar cache
- [ ] Otimizar queries do MongoDB
- [ ] Minificar frontend (build)
- [ ] Configurar CDN para assets

### Monitoramento
- [ ] Configurar logs (Winston/Morgan)
- [ ] Adicionar error tracking (Sentry)
- [ ] Configurar uptime monitoring
- [ ] Analytics (Google Analytics)

## 🌐 Opções de Hospedagem

### Backend

#### 1. Railway (Recomendado - Mais Fácil)
**Preço:** $5-20/mês
**Vantagens:** Deploy automático, fácil configuração

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Criar projeto
railway init

# Deploy
railway up
```

**Configurar variáveis:**
- Ir em Settings > Variables
- Adicionar todas do .env

#### 2. Heroku
**Preço:** $7-25/mês
**Vantagens:** Muito popular, fácil de usar

```bash
# Instalar CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create seu-app-sms

# Adicionar MongoDB
heroku addons:create mongolab

# Deploy
git push heroku main
```

#### 3. DigitalOcean App Platform
**Preço:** $5-12/mês
**Vantagens:** Bom custo-benefício

1. Conectar repositório GitHub
2. Configurar build command: `npm install`
3. Configurar run command: `npm start`
4. Adicionar variáveis de ambiente

#### 4. VPS (DigitalOcean/Linode)
**Preço:** $5-10/mês
**Vantagens:** Controle total, mais barato em escala

```bash
# Conectar via SSH
ssh root@seu-ip

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
npm install -g pm2

# Clonar repositório
git clone seu-repositorio
cd seu-repositorio

# Instalar dependências
npm install

# Iniciar com PM2
pm2 start server.js --name sms-panel
pm2 startup
pm2 save
```

### Frontend

#### 1. Vercel (Recomendado)
**Preço:** Grátis
**Vantagens:** Deploy automático, CDN global, HTTPS grátis

```bash
# Instalar CLI
npm install -g vercel

# Deploy
cd client
vercel

# Configurar variável de ambiente
# REACT_APP_API_URL=https://seu-backend.railway.app
```

#### 2. Netlify
**Preço:** Grátis
**Vantagens:** Similar ao Vercel

```bash
# Instalar CLI
npm install -g netlify-cli

# Build
cd client
npm run build

# Deploy
netlify deploy --prod
```

#### 3. Cloudflare Pages
**Preço:** Grátis
**Vantagens:** CDN rápido, DDoS protection

1. Conectar repositório GitHub
2. Build command: `cd client && npm run build`
3. Publish directory: `client/build`

## 🔧 Configurações de Produção

### 1. Atualizar CORS

```javascript
// server.js
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 2. Adicionar Segurança

```bash
npm install helmet express-rate-limit
```

```javascript
// server.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

### 3. Adicionar Logs

```bash
npm install winston morgan
```

```javascript
// server.js
const morgan = require('morgan');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.use(morgan('combined'));
```

### 4. Configurar Variáveis de Ambiente

```javascript
// client/src/config.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

```javascript
// Atualizar axios
import { API_URL } from './config';
axios.defaults.baseURL = API_URL;
```

## 🗄️ MongoDB em Produção

### MongoDB Atlas (Recomendado)
1. Criar cluster em https://cloud.mongodb.com
2. Configurar IP whitelist (0.0.0.0/0 para permitir todos)
3. Criar usuário de banco
4. Copiar connection string
5. Adicionar em variáveis de ambiente

**Connection String:**
```
mongodb+srv://usuario:senha@cluster.mongodb.net/sms-panel?retryWrites=true&w=majority
```

## 🌐 Domínio Personalizado

### 1. Comprar Domínio
- Registro.br (Brasil): R$ 40/ano
- Namecheap: $10/ano
- GoDaddy: $12/ano

### 2. Configurar DNS

**Para Vercel (Frontend):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**Para Railway (Backend):**
```
Type: CNAME
Name: api
Value: seu-app.railway.app
```

### 3. Configurar SSL
- Vercel/Netlify: Automático
- Railway: Automático
- VPS: Usar Let's Encrypt

```bash
# Let's Encrypt no VPS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com
```

## 📊 Monitoramento

### 1. Uptime Monitoring
**UptimeRobot** (Grátis)
- Monitora a cada 5 minutos
- Alerta por email/SMS
- https://uptimerobot.com

### 2. Error Tracking
**Sentry** (Grátis até 5k eventos/mês)

```bash
npm install @sentry/node @sentry/react
```

```javascript
// server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

app.use(Sentry.Handlers.errorHandler());
```

### 3. Analytics
**Google Analytics**

```html
<!-- client/public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 CI/CD (Deploy Automático)

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to Railway
      run: railway up
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 📱 Configurar Webhooks

### Ngrok para Testes
```bash
ngrok http 5000
```

### Produção
```
https://api.seudominio.com/api/webhooks/twilio/sms
```

Configurar no Twilio:
1. Phone Numbers > Manage > Active Numbers
2. Selecionar número
3. Messaging > Webhook URL
4. Adicionar URL acima

## 🔐 Backup

### MongoDB Atlas
- Backup automático diário
- Retenção de 7 dias (grátis)
- Restauração com 1 clique

### Manual
```bash
# Backup
mongodump --uri="mongodb+srv://..." --out=backup

# Restore
mongorestore --uri="mongodb+srv://..." backup
```

## 📈 Escala

### Quando Escalar?
- CPU > 80% consistentemente
- Memória > 80%
- Tempo de resposta > 1s
- Mais de 1000 usuários simultâneos

### Como Escalar?

**Vertical (Mais recursos):**
- Aumentar plano do servidor
- Mais RAM/CPU

**Horizontal (Mais servidores):**
- Load balancer
- Múltiplas instâncias
- Redis para sessões

## ✅ Checklist Final

- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e funcionando
- [ ] MongoDB Atlas configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado
- [ ] SSL ativo (HTTPS)
- [ ] Webhooks configurados
- [ ] Monitoramento ativo
- [ ] Backups configurados
- [ ] Logs funcionando
- [ ] Testes realizados
- [ ] Documentação atualizada

## 🎉 Pós-Deploy

1. Testar fluxo completo
2. Criar primeiros números
3. Fazer primeira verificação
4. Monitorar logs por 24h
5. Ajustar conforme necessário
6. Começar marketing!

## 💰 Custos Mensais Estimados

```
MongoDB Atlas (Free): R$ 0
Railway (Backend): R$ 25
Vercel (Frontend): R$ 0
Domínio: R$ 3
Twilio (10 números): R$ 75
Total: ~R$ 103/mês

Com 100 verificações/dia:
Receita: R$ 15.000
Custos: R$ 103 + R$ 900 = R$ 1.003
Lucro: R$ 13.997/mês 🚀
```

## 📞 Suporte

Problemas no deploy?
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- MongoDB: https://support.mongodb.com
