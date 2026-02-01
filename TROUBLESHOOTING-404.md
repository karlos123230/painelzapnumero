# 🔧 Troubleshooting - Erro 404

## 🔍 DIAGNÓSTICO

Você está vendo erro 404 no console do navegador. Isso significa que o **frontend não consegue se conectar ao backend**.

## ✅ CHECKLIST DE VERIFICAÇÃO

### 1️⃣ Verificar se o Backend está Rodando

Abra no navegador:
```
https://sms-panel-api.onrender.com/api/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "message": "Servidor funcionando!",
  "mongodb": "conectado",
  "twilio": "configurado"
}
```

**Se der erro 404 ou timeout:**
- ❌ Backend não está rodando
- ✅ **SOLUÇÃO:** Fazer deploy do backend no Render

### 2️⃣ Verificar Variável de Ambiente do Frontend

No Render Dashboard:
1. Vá em **sms-panel-frontend**
2. Clique em **"Environment"**
3. Verifique se existe:

```
REACT_APP_API_URL = https://sms-panel-api.onrender.com
```

**Se não existir:**
- ❌ Frontend está tentando acessar localhost
- ✅ **SOLUÇÃO:** Adicionar a variável e fazer redeploy

### 3️⃣ Verificar Logs do Backend

No Render Dashboard:
1. Vá em **sms-panel-api**
2. Clique em **"Logs"**
3. Procure por erros

**Erros comuns:**
```
Error: connect ECONNREFUSED
```
→ MongoDB não está acessível

```
MongooseError: buffering timed out
```
→ String de conexão do MongoDB incorreta

```
Error: Cannot find module
```
→ Dependências não foram instaladas

### 4️⃣ Verificar CORS no Backend

No Render Dashboard (backend):
1. Vá em **"Environment"**
2. Verifique se existe:

```
FRONTEND_URL = https://sms-panel-frontend.onrender.com
```

**Se não existir:**
- ❌ CORS vai bloquear as requisições
- ✅ **SOLUÇÃO:** Adicionar a variável e reiniciar

### 5️⃣ Verificar MongoDB Atlas

1. Acesse: https://cloud.mongodb.com
2. Vá em **Network Access**
3. Verifique se tem: `0.0.0.0/0` (permitir todos)

**Se não tiver:**
- ❌ Render não consegue conectar ao MongoDB
- ✅ **SOLUÇÃO:** Adicionar IP 0.0.0.0/0

## 🚀 SOLUÇÃO RÁPIDA

### Passo 1: Deploy do Backend

```bash
# No Render Dashboard
1. Vá em "sms-panel-api"
2. Clique em "Manual Deploy" → "Deploy latest commit"
3. Aguarde 5-10 minutos
4. Teste: https://sms-panel-api.onrender.com/api/health
```

### Passo 2: Configurar Variáveis do Backend

```
MONGODB_URI = mongodb+srv://musicoterapeutakarlos_db_user:aTtgtupoXqc0Y36k@cluster0.iyjxx0b.mongodb.net/sms-panel?retryWrites=true&w=majority

JWT_SECRET = sua_chave_secreta_longa_123456789

TWILIO_ACCOUNT_SID = (suas credenciais)

TWILIO_AUTH_TOKEN = (suas credenciais)

FRONTEND_URL = https://sms-panel-frontend.onrender.com

WEBHOOK_URL = https://sms-panel-api.onrender.com
```

### Passo 3: Configurar Variável do Frontend

```
REACT_APP_API_URL = https://sms-panel-api.onrender.com
```

### Passo 4: Redeploy do Frontend

```bash
# No Render Dashboard
1. Vá em "sms-panel-frontend"
2. Clique em "Manual Deploy" → "Deploy latest commit"
3. Aguarde 5-10 minutos
```

### Passo 5: Limpar Cache do Navegador

```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

## 🔍 TESTE MANUAL

### Teste 1: Backend Health
```bash
curl https://sms-panel-api.onrender.com/api/health
```

Deve retornar JSON com `"status": "ok"`

### Teste 2: Registro de Usuário
```bash
curl -X POST https://sms-panel-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"123456"}'
```

Deve retornar token e dados do usuário

### Teste 3: Frontend Console
```javascript
// Abra o Console do navegador (F12) e digite:
console.log(window.location.origin);
// Deve mostrar: https://sms-panel-frontend.onrender.com

// Verifique a URL da API:
fetch('https://sms-panel-api.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log);
// Deve mostrar o objeto de health
```

## ⚠️ PROBLEMAS ESPECÍFICOS

### "Failed to load resource: 404" em /api/auth/login
**Causa:** Backend não está rodando ou URL incorreta  
**Solução:** Verificar passos 1 e 2 acima

### "CORS policy: No 'Access-Control-Allow-Origin'"
**Causa:** FRONTEND_URL não configurado no backend  
**Solução:** Adicionar variável FRONTEND_URL no backend

### "Network Error" ou "ERR_CONNECTION_REFUSED"
**Causa:** Backend não está acessível  
**Solução:** Verificar se o deploy do backend terminou

### Tela branca no frontend
**Causa:** Build do React falhou ou variável não configurada  
**Solução:** Ver logs do frontend no Render

## 📞 ÚLTIMA OPÇÃO

Se nada funcionar, recrie os serviços:

### Backend
```
Name: sms-panel-api-v2
Root Directory: (vazio)
Build Command: npm install
Start Command: node server-twilio.js
```

### Frontend
```
Name: sms-panel-frontend-v2
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: build
```

Depois configure todas as variáveis de ambiente novamente.

---

**Dica:** O plano FREE do Render "dorme" após 15 min de inatividade. A primeira requisição pode demorar 30-60 segundos para "acordar" o serviço.
