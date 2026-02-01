# 🧪 Teste Rápido do Backend

## 🎯 Seu Backend
```
https://painelzapnumero.onrender.com
```

## ✅ TESTES PARA FAZER AGORA

### Teste 1: Health Check
Abra no navegador:
```
https://painelzapnumero.onrender.com/api/health
```

**O que você vê?**

**Opção A - Sucesso ✅**
```json
{
  "status": "ok",
  "mongodb": "conectado",
  "twilio": "configurado"
}
```
→ Backend está funcionando! Vá para o Teste 2.

**Opção B - Erro 404 ❌**
```
Cannot GET /api/health
```
→ Backend não está rodando ou comando de start está errado.

**Opção C - Timeout/Loading infinito ⏳**
```
(página carregando eternamente)
```
→ Serviço está "dormindo" ou não iniciou. Aguarde 60 segundos.

**Opção D - Erro 500 ❌**
```json
{
  "status": "error",
  "message": "..."
}
```
→ Backend rodando mas com erro. Veja a mensagem.

### Teste 2: Registro de Usuário

Se o Teste 1 passou, teste o registro:

**No navegador, abra o Console (F12) e cole:**
```javascript
fetch('https://painelzapnumero.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'teste@teste.com',
    password: '123456'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Sucesso:', data);
})
.catch(err => {
  console.error('❌ Erro:', err);
});
```

**O que você vê?**

**Opção A - Sucesso ✅**
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "...",
    email: "teste@teste.com",
    balance: 100,
    isAdmin: true
  }
}
```
→ Perfeito! Backend está 100% funcional.

**Opção B - CORS Error ❌**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
→ Variável FRONTEND_URL não está configurada no backend.

**Opção C - Network Error ❌**
```
Failed to fetch
```
→ Backend não está acessível.

### Teste 3: Login

Se o Teste 2 passou, teste o login:

```javascript
fetch('https://painelzapnumero.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'teste@teste.com',
    password: '123456'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Login:', data);
})
.catch(err => {
  console.error('❌ Erro:', err);
});
```

Deve retornar o mesmo formato do Teste 2.

## 🔍 DIAGNÓSTICO

### Se TODOS os testes passaram ✅
→ Backend está perfeito! O problema é no frontend.

**Solução:**
1. Configure `REACT_APP_API_URL = https://painelzapnumero.onrender.com` no frontend
2. Faça redeploy do frontend
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Se Teste 1 falhou ❌
→ Backend não está rodando.

**Solução:**
1. Vá no Render Dashboard → painelzapnumero
2. Veja os "Logs"
3. Procure por erros em vermelho
4. Verifique se o "Start Command" é: `node server-twilio.js`
5. Faça "Manual Deploy" → "Clear build cache & deploy"

### Se Teste 1 passou mas Teste 2 falhou ❌
→ Backend rodando mas com problemas.

**Possíveis causas:**
- MongoDB não conectou (veja logs)
- Variáveis de ambiente faltando
- Erro no código

**Solução:**
1. Veja os logs no Render
2. Confirme que MONGODB_URI está correto
3. Teste a conexão MongoDB no Atlas

## 📋 CHECKLIST DE VARIÁVEIS

No Render Dashboard → painelzapnumero → Environment:

```
✅ MONGODB_URI = mongodb+srv://musicoterapeutakarlos_db_user:...
✅ JWT_SECRET = qualquer_string_longa
✅ TWILIO_ACCOUNT_SID = (suas_credenciais)
✅ TWILIO_AUTH_TOKEN = (suas_credenciais)
✅ WEBHOOK_URL = https://painelzapnumero.onrender.com
✅ FRONTEND_URL = (URL do seu frontend)
```

## 🚀 DEPOIS DOS TESTES

**Me diga os resultados:**

1. Teste 1 (health): ✅ ou ❌?
2. Teste 2 (register): ✅ ou ❌?
3. Teste 3 (login): ✅ ou ❌?
4. Qual é a URL do seu frontend?

Com essas informações, posso te ajudar a resolver o problema específico!

---

**Importante:** Se o backend estiver "dormindo" (plano FREE), a primeira requisição pode demorar 30-60 segundos. Seja paciente! ⏳
