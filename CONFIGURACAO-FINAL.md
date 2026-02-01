# ⚡ CONFIGURAÇÃO FINAL - SUAS URLs

## 🎯 SUAS URLs CORRETAS

- **Backend:** `https://painelzapnumero.onrender.com`
- **Frontend:** `https://painelzapnumero-1.onrender.com`

## ✅ PASSO 1: Configurar Backend

1. Acesse: https://dashboard.render.com
2. Clique no serviço **painelzapnumero** (backend)
3. Vá em **"Environment"**
4. Adicione/Atualize estas variáveis EXATAS:

```
MONGODB_URI
mongodb+srv://musicoterapeutakarlos_db_user:aTtgtupoXqc0Y36k@cluster0.iyjxx0b.mongodb.net/sms-panel?retryWrites=true&w=majority

JWT_SECRET
minha_chave_secreta_super_segura_12345678

TWILIO_ACCOUNT_SID
(suas_credenciais_twilio_account_sid)

TWILIO_AUTH_TOKEN
(suas_credenciais_twilio_auth_token)

WEBHOOK_URL
https://painelzapnumero.onrender.com

FRONTEND_URL
https://painelzapnumero-1.onrender.com
```

5. Clique em **"Save Changes"**
6. Aguarde o serviço reiniciar (1-2 minutos)

## ✅ PASSO 2: Testar Backend

Abra no navegador:
```
https://painelzapnumero.onrender.com/api/health
```

**Deve mostrar:**
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

**Se der erro 404:**
- Aguarde 30-60 segundos (serviço pode estar acordando)
- Recarregue a página
- Se continuar, veja os logs no Render

## ✅ PASSO 3: Configurar Frontend

1. No Render Dashboard
2. Clique no serviço **painelzapnumero-1** (frontend)
3. Vá em **"Environment"**
4. Adicione/Atualize:

```
REACT_APP_API_URL
https://painelzapnumero.onrender.com
```

5. Clique em **"Save Changes"**

## ✅ PASSO 4: Redeploy do Frontend

1. Ainda no serviço **painelzapnumero-1**
2. Clique em **"Manual Deploy"**
3. Selecione **"Clear build cache & deploy"**
4. Aguarde 5-10 minutos

## ✅ PASSO 5: Testar Sistema Completo

1. Acesse: `https://painelzapnumero-1.onrender.com`
2. Clique em **"Register"**
3. Crie uma conta:
   - Email: seu@email.com
   - Senha: 123456
4. Faça login
5. Você deve ver o Dashboard

**Primeiro usuário é automaticamente ADMIN!**

## ✅ PASSO 6: Comprar Números do Twilio

1. No menu, clique em **"Admin Panel"**
2. Vá na aba **"Twilio - Buy Numbers"**
3. Selecione um país (US, BR, etc)
4. Clique em **"Search Numbers"**
5. Clique em **"Buy"** em um número disponível
6. Aguarde a confirmação

## 🔍 VERIFICAÇÃO RÁPIDA

### Teste no Console do Navegador (F12)

Abra o console e cole:

```javascript
// Teste 1: Verificar URL da API
console.log('API URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000');

// Teste 2: Testar conexão
fetch('https://painelzapnumero.onrender.com/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend:', data))
  .catch(err => console.error('❌ Erro:', err));
```

## ⚠️ PROBLEMAS COMUNS

### Erro: "Failed to load resource: 404"

**Causa:** Frontend não encontra o backend

**Solução:**
1. Confirme que `REACT_APP_API_URL` está configurado no frontend
2. Faça redeploy do frontend (Passo 4)
3. Limpe o cache: Ctrl+Shift+R

### Erro: "CORS policy"

**Causa:** `FRONTEND_URL` não está configurado no backend

**Solução:**
1. Confirme que `FRONTEND_URL = https://painelzapnumero-1.onrender.com` no backend
2. Salve e aguarde reiniciar

### Tela branca no frontend

**Causa:** Build falhou ou variável não foi aplicada

**Solução:**
1. Veja os logs do frontend no Render
2. Faça "Clear build cache & deploy"
3. Aguarde o build terminar

### Backend demora para responder

**Causa:** Plano FREE "dorme" após 15 min

**Solução:**
- Aguarde 30-60 segundos na primeira requisição
- Use UptimeRobot para manter ativo: https://uptimerobot.com

## 🎯 FLUXO COMPLETO DE TESTE

1. ✅ Backend health: `https://painelzapnumero.onrender.com/api/health`
2. ✅ Frontend carrega: `https://painelzapnumero-1.onrender.com`
3. ✅ Registrar usuário
4. ✅ Fazer login
5. ✅ Ver Dashboard
6. ✅ Acessar Admin Panel
7. ✅ Buscar números do Twilio
8. ✅ Comprar um número
9. ✅ Ver número na lista

## 📊 VARIÁVEIS FINAIS

### Backend (painelzapnumero)
```
MONGODB_URI = mongodb+srv://musicoterapeutakarlos_db_user:aTtgtupoXqc0Y36k@cluster0.iyjxx0b.mongodb.net/sms-panel?retryWrites=true&w=majority
JWT_SECRET = minha_chave_secreta_super_segura_12345678
TWILIO_ACCOUNT_SID = (suas_credenciais)
TWILIO_AUTH_TOKEN = (suas_credenciais)
WEBHOOK_URL = https://painelzapnumero.onrender.com
FRONTEND_URL = https://painelzapnumero-1.onrender.com
```

### Frontend (painelzapnumero-1)
```
REACT_APP_API_URL = https://painelzapnumero.onrender.com
```

## 🚀 DEPOIS DE CONFIGURAR

1. **Configurar Webhooks do Twilio:**
   - Acesse: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
   - Para cada número comprado:
   - Configure webhook: `https://painelzapnumero.onrender.com/api/webhooks/twilio/sms`
   - Método: POST

2. **Testar recebimento de SMS:**
   - Alugue um número no sistema
   - Envie SMS para ele
   - Veja o código aparecer no painel

3. **Manter serviço ativo (opcional):**
   - Crie conta em: https://uptimerobot.com
   - Adicione monitor: `https://painelzapnumero.onrender.com/api/health`
   - Intervalo: 5 minutos

## 🎉 PRONTO!

Seu sistema está configurado e pronto para uso!

**Próximos passos:**
- ✅ Comprar números reais do Twilio
- ✅ Testar recebimento de SMS
- ✅ Adicionar mais usuários
- ✅ Começar a ganhar dinheiro! 💰

---

**Suporte:** Se algo não funcionar, veja os logs no Render Dashboard e me avise qual erro aparece.
