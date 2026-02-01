# 🚀 Deploy Rápido - Guia Resumido

## ✅ O QUE FOI CORRIGIDO

O sistema agora usa **MongoDB** em vez de memória temporária. Isso significa:
- ✅ Dados persistem após reiniciar o servidor
- ✅ Usuários e números não são perdidos
- ✅ Sistema funciona corretamente no Render

## 📋 PASSOS PARA DEPLOY

### 1. Backend (API)

No Render Dashboard:
1. Vá no serviço **sms-panel-api**
2. Clique em **"Manual Deploy"** → **"Deploy latest commit"**
3. Aguarde 5-10 minutos

### 2. Verificar Backend

Abra no navegador:
```
https://sms-panel-api.onrender.com/api/health
```

Deve mostrar:
```json
{
  "status": "ok",
  "mongodb": "conectado",
  "twilio": "configurado"
}
```

### 3. Frontend

No Render Dashboard:
1. Vá no serviço **sms-panel-frontend**
2. Clique em **"Manual Deploy"** → **"Deploy latest commit"**
3. Aguarde 5-10 minutos

### 4. Testar!

Acesse: `https://sms-panel-frontend.onrender.com`

1. Registre uma conta (primeiro usuário é admin)
2. Faça login
3. Vá no Admin Panel
4. Compre números do Twilio
5. Teste o sistema!

## 🔧 VARIÁVEIS DE AMBIENTE

### Backend (sms-panel-api)

Certifique-se que estas variáveis estão configuradas:

```
MONGODB_URI = sua_string_de_conexao_mongodb_atlas

JWT_SECRET = qualquer_string_secreta_longa_123456789

TWILIO_ACCOUNT_SID = seu_twilio_account_sid

TWILIO_AUTH_TOKEN = seu_twilio_auth_token

FRONTEND_URL = https://sms-panel-frontend.onrender.com

WEBHOOK_URL = https://sms-panel-api.onrender.com
```

**IMPORTANTE:** Use suas credenciais reais aqui!

### Frontend (sms-panel-frontend)

```
REACT_APP_API_URL = https://sms-panel-api.onrender.com
```

## ⚠️ PROBLEMAS COMUNS

### Backend retorna 404
- Verifique se o deploy terminou
- Veja os logs no Render Dashboard
- Confirme que MONGODB_URI está correto

### Frontend tela branca
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se REACT_APP_API_URL está correto
- Veja os logs no Render Dashboard

### "Cannot connect to database"
- Verifique se o MongoDB Atlas está acessível
- Confirme que o IP 0.0.0.0/0 está liberado no Atlas
- Teste a string de conexão

## 🎯 PRÓXIMOS PASSOS

Após o deploy funcionar:

1. **Comprar números reais:**
   - Login como admin
   - Vá em "Admin Panel" → "Twilio - Buy Numbers"
   - Busque e compre números

2. **Configurar webhooks:**
   - Acesse: https://console.twilio.com
   - Configure webhook: `https://sms-panel-api.onrender.com/api/webhooks/twilio/sms`

3. **Testar recebimento de SMS:**
   - Alugue um número
   - Envie SMS para ele
   - Veja o código aparecer no painel

## 💰 CUSTOS

- Render Backend: Grátis (750h/mês)
- Render Frontend: Grátis (100GB)
- MongoDB Atlas: Grátis (512MB)
- **Total: R$ 0/mês!** 🎉

## 📞 SUPORTE

Se algo não funcionar:
1. Veja os logs no Render Dashboard
2. Teste o endpoint /api/health
3. Verifique as variáveis de ambiente
4. Confirme que o código foi atualizado no GitHub

---

**Última atualização:** 31/01/2026
**Versão:** 2.0 (com MongoDB)
