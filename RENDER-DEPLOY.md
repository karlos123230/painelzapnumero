# 🚀 Deploy no Render - Guia Completo

## ✅ Arquivos Já Configurados!

O projeto já está pronto para deploy no Render com:
- ✅ `render.yaml` configurado
- ✅ URLs dinâmicas no frontend
- ✅ Variáveis de ambiente preparadas

## 📋 Passo a Passo

### 1️⃣ Criar Conta no Render

1. Acesse: https://dashboard.render.com/register
2. Faça login com GitHub
3. Autorize o Render a acessar seus repositórios

### 2️⃣ Criar Banco de Dados MongoDB

**Opção A - MongoDB Atlas (Recomendado - Grátis):**

1. Acesse: https://cloud.mongodb.com
2. Crie um cluster FREE
3. Configure IP whitelist: `0.0.0.0/0` (permitir todos)
4. Copie a string de conexão
5. Guarde para usar nas variáveis de ambiente

**Opção B - Render PostgreSQL (Alternativa):**
- Se preferir, pode adaptar o código para PostgreSQL
- Render oferece PostgreSQL grátis

### 3️⃣ Deploy do Backend

1. No Render Dashboard, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório: `karlos123230/painelzapnumero`
4. Configure:

```
Name: sms-panel-backend
Region: Oregon (US West)
Branch: main
Root Directory: (deixe vazio)
Runtime: Node
Build Command: npm install
Start Command: node server-twilio.js
Instance Type: Free
```

5. **Adicione as Variáveis de Ambiente:**

Clique em "Advanced" e adicione:

```
NODE_VERSION = 18.17.0
PORT = 10000
MONGODB_URI = sua_string_mongodb_atlas
JWT_SECRET = gere_uma_chave_secreta_forte_aqui
TWILIO_ACCOUNT_SID = seu_twilio_account_sid
TWILIO_AUTH_TOKEN = seu_twilio_auth_token
WEBHOOK_URL = https://sms-panel-backend.onrender.com
FRONTEND_URL = https://sms-panel-frontend.onrender.com
```

6. Clique em **"Create Web Service"**
7. Aguarde o deploy (5-10 minutos)
8. Copie a URL gerada (ex: `https://sms-panel-backend.onrender.com`)

### 4️⃣ Deploy do Frontend

1. No Render Dashboard, clique em **"New +"**
2. Selecione **"Static Site"**
3. Conecte o mesmo repositório
4. Configure:

```
Name: sms-panel-frontend
Branch: main
Root Directory: (deixe vazio)
Build Command: cd client && npm install && npm run build
Publish Directory: client/build
```

5. **Adicione Variável de Ambiente:**

```
REACT_APP_API_URL = https://sms-panel-backend.onrender.com
```

(Use a URL do backend que você copiou no passo anterior)

6. Clique em **"Create Static Site"**
7. Aguarde o deploy (5-10 minutos)
8. Copie a URL gerada (ex: `https://sms-panel-frontend.onrender.com`)

### 5️⃣ Atualizar Variáveis do Backend

Volte no serviço do **backend** e atualize:

```
FRONTEND_URL = https://sms-panel-frontend.onrender.com
WEBHOOK_URL = https://sms-panel-backend.onrender.com
```

(Use as URLs reais que foram geradas)

Clique em "Save Changes" - o backend vai reiniciar automaticamente.

### 6️⃣ Configurar Twilio Webhook

1. Acesse: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Clique em cada número comprado
3. Em "Messaging" > "A MESSAGE COMES IN":
   ```
   https://sms-panel-backend.onrender.com/api/webhooks/twilio/sms
   ```
4. Método: **POST**
5. Salve

### 7️⃣ Testar o Sistema

1. Acesse sua URL do frontend: `https://sms-panel-frontend.onrender.com`
2. Registre uma conta
3. Faça login
4. Teste o sistema!

## 🎯 URLs Finais

Depois do deploy, você terá:

- **Frontend:** `https://sms-panel-frontend.onrender.com`
- **Backend API:** `https://sms-panel-backend.onrender.com`
- **Webhook Twilio:** `https://sms-panel-backend.onrender.com/api/webhooks/twilio/sms`

## ⚠️ Importante - Plano Free

O plano FREE do Render tem algumas limitações:

- **Sleep após 15 min de inatividade**
  - Primeira requisição pode demorar 30-60s
  - Depois funciona normalmente

- **750 horas/mês grátis**
  - Suficiente para 1 serviço 24/7
  - Ou 2 serviços com uso moderado

- **Solução:** Usar um serviço de "ping" para manter ativo
  - UptimeRobot: https://uptimerobot.com (grátis)
  - Configurar para fazer ping a cada 5 minutos

## 🔧 Troubleshooting

### Backend não inicia:
- Verifique os logs no Render Dashboard
- Confirme que todas as variáveis de ambiente estão corretas
- Verifique se o MongoDB está acessível

### Frontend não conecta ao backend:
- Verifique se `REACT_APP_API_URL` está correto
- Confirme que o backend está rodando
- Verifique CORS no backend

### Webhook não funciona:
- Confirme que a URL do webhook está correta no Twilio
- Verifique se o backend está acessível publicamente
- Veja os logs do Render para erros

## 💰 Custos

### Render Free:
- Backend: **Grátis** (750h/mês)
- Frontend: **Grátis** (100GB bandwidth/mês)

### MongoDB Atlas:
- Cluster M0: **Grátis** (512MB storage)

### Twilio:
- Números: **$1-2/mês** cada
- SMS recebidos: **Grátis**

### Total Mensal:
- **$0** (infraestrutura)
- **$1-2** por número virtual
- **Lucro:** Quase 100% do que você cobrar! 🚀

## 🎉 Pronto!

Seu sistema está no ar e funcionando!

Agora você pode:
- Comprar números reais do Twilio
- Receber SMS/WhatsApp
- Alugar para usuários
- Ganhar dinheiro! 💰

## 📞 Suporte

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
