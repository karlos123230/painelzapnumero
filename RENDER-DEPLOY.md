# 🚀 Deploy no Render - Guia Simplificado

## ⚠️ IMPORTANTE: Deploy Separado

O backend e frontend devem ser deployados como **2 serviços separados** no Render.

## 📋 Passo a Passo

### 1️⃣ Preparar MongoDB Atlas

1. Acesse: https://cloud.mongodb.com
2. Crie um cluster FREE (M0)
3. Configure Network Access: `0.0.0.0/0` (permitir todos)
4. Crie usuário de banco de dados
5. Copie a string de conexão:
   ```
   mongodb+srv://usuario:senha@cluster.mongodb.net/sms-panel?retryWrites=true&w=majority
   ```

### 2️⃣ Deploy do BACKEND (API)

1. Acesse: https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório: `karlos123230/painelzapnumero`
4. Configure:

```
Name: sms-panel-api
Region: Oregon (US West)
Branch: main
Root Directory: (deixe vazio)
Runtime: Node
Build Command: npm install
Start Command: node server-twilio.js
Instance Type: Free
```

5. **Environment Variables** (clique em "Add Environment Variable"):

```
MONGODB_URI = sua_string_de_conexao_mongodb_atlas
JWT_SECRET = qualquer_string_secreta_longa_aqui_123456789
TWILIO_ACCOUNT_SID = seu_twilio_account_sid
TWILIO_AUTH_TOKEN = seu_twilio_auth_token
WEBHOOK_URL = (deixe vazio por enquanto - será preenchido depois)
FRONTEND_URL = (deixe vazio por enquanto - será preenchido depois)
```

**IMPORTANTE:** Use suas credenciais reais do MongoDB Atlas e Twilio aqui!

6. Clique em **"Create Web Service"**
7. Aguarde o deploy (5-10 min)
8. **Copie a URL gerada** (ex: `https://sms-panel-api.onrender.com`)

### 3️⃣ Deploy do FRONTEND

1. No Render Dashboard, clique em **"New +"** → **"Static Site"**
2. Conecte o mesmo repositório
3. Configure:

```
Name: sms-panel-frontend
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: build
```

4. **Environment Variables:**

```
REACT_APP_API_URL = https://sms-panel-api.onrender.com
```

(Use a URL do backend que você copiou no passo 2)

5. Clique em **"Create Static Site"**
6. Aguarde o deploy (5-10 min)
7. **Copie a URL gerada** (ex: `https://sms-panel-frontend.onrender.com`)

### 4️⃣ Atualizar Backend com URLs

1. Volte no serviço **sms-panel-api**
2. Vá em **"Environment"**
3. Atualize as variáveis:

```
FRONTEND_URL = https://sms-panel-frontend.onrender.com
WEBHOOK_URL = https://sms-panel-api.onrender.com
```

(Use as URLs reais que você copiou nos passos anteriores)

4. Clique em **"Save Changes"**
5. O backend vai reiniciar automaticamente

### 5️⃣ Testar o Backend

Antes de continuar, teste se o backend está funcionando:

1. Abra no navegador: `https://sms-panel-api.onrender.com/api/health`
2. Você deve ver algo como:
```json
{
  "status": "ok",
  "message": "Servidor funcionando!",
  "mongodb": "conectado",
  "twilio": "configurado",
  "users": 0,
  "numbers": 0,
  "orders": 0
}
```

Se aparecer erro, verifique os logs do backend no Render Dashboard.

### 6️⃣ Configurar Twilio (Opcional - Para SMS Real)

1. Acesse: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Para cada número comprado:
   - Clique no número
   - Em "Messaging" → "A MESSAGE COMES IN":
     ```
     https://sms-panel-api.onrender.com/api/webhooks/twilio/sms
     ```
   - Método: **POST**
   - Salve

### 7️⃣ Testar!

1. Acesse: `https://sms-panel-frontend.onrender.com`
2. Registre uma conta
3. Faça login
4. Teste o sistema!

## 🎯 URLs Finais

- **Frontend:** `https://sms-panel-frontend.onrender.com`
- **Backend API:** `https://sms-panel-api.onrender.com`
- **API Health:** `https://sms-panel-api.onrender.com/api/health`

## ⚠️ Problemas Comuns

### "Cannot GET /"
- **Causa:** Tentou fazer deploy como serviço único
- **Solução:** Fazer 2 deploys separados (backend + frontend)

### Frontend não conecta ao backend
- Verifique se `REACT_APP_API_URL` está correto
- Confirme que o backend está rodando
- Teste a API: `https://sms-panel-api.onrender.com/api/health`

### Backend demora para responder
- Plano FREE "dorme" após 15 min de inatividade
- Primeira requisição pode demorar 30-60s
- Use UptimeRobot para manter ativo: https://uptimerobot.com

### Erro de CORS
- Verifique se `FRONTEND_URL` está configurado no backend
- Deve ser a URL exata do frontend no Render

## 💰 Custos

- **Render Backend:** Grátis (750h/mês)
- **Render Frontend:** Grátis (100GB bandwidth)
- **MongoDB Atlas:** Grátis (512MB)
- **Total:** R$ 0/mês! 🎉

## 🔧 Manter Serviço Ativo (Opcional)

O plano FREE "dorme" após 15 min. Para manter ativo:

1. Crie conta em: https://uptimerobot.com (grátis)
2. Adicione monitor:
   - Type: HTTP(s)
   - URL: `https://sms-panel-api.onrender.com/api/health`
   - Interval: 5 minutes
3. Pronto! Seu serviço ficará sempre ativo

## 📊 Verificar Logs

Se algo der errado:

1. No Render Dashboard
2. Clique no serviço (backend ou frontend)
3. Vá em **"Logs"**
4. Veja os erros e corrija

## 🎉 Pronto!

Seu sistema está no ar e funcionando!

Agora você pode:
- ✅ Comprar números reais do Twilio
- ✅ Receber SMS/WhatsApp
- ✅ Alugar para usuários
- ✅ Ganhar dinheiro! 💰
