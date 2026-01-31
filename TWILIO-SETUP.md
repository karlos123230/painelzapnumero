# 🚀 Configuração Rápida do Twilio

## 📋 Passo a Passo

### 1️⃣ Criar Conta no Twilio (2 minutos)

1. Acesse: https://www.twilio.com/try-twilio
2. Clique em "Sign up"
3. Preencha seus dados
4. Verifique seu email e telefone
5. **Você ganha $15 de crédito grátis!** 🎉

### 2️⃣ Obter Credenciais

1. Faça login em: https://console.twilio.com
2. No Dashboard, você verá:
   - **Account SID** (começa com AC...)
   - **Auth Token** (clique em "Show" para ver)
3. Copie ambos!

### 3️⃣ Configurar no Projeto

Abra o arquivo `.env` e cole suas credenciais:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WEBHOOK_URL=http://localhost:5000
```

### 4️⃣ Iniciar Servidor com Twilio

```bash
node server-twilio.js
```

### 5️⃣ Comprar Números

#### Opção A - Via Painel Admin:

1. Faça login como admin
2. Vá em: http://localhost:3000/admin
3. Use a seção "Twilio" para:
   - Buscar números disponíveis
   - Comprar números
   - Ver números comprados

#### Opção B - Via API:

```bash
# Buscar números disponíveis no Brasil
curl http://localhost:5000/api/twilio/search-numbers?countryCode=BR \
  -H "Authorization: Bearer SEU_TOKEN"

# Comprar número
curl -X POST http://localhost:5000/api/twilio/buy-number \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+5511999999999",
    "country": "Brasil",
    "countryCode": "55",
    "price": 5.00
  }'
```

### 6️⃣ Configurar Webhook (Para Receber SMS)

#### Para Testes Locais - Use ngrok:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 5000
ngrok http 5000

# Copiar URL gerada (ex: https://abc123.ngrok.io)
```

Atualize no `.env`:
```env
WEBHOOK_URL=https://abc123.ngrok.io
```

Reinicie o servidor e os webhooks funcionarão!

#### Para Produção:

Use seu domínio real:
```env
WEBHOOK_URL=https://seudominio.com
```

## 💰 Custos

### Números Virtuais:
- **Brasil:** ~$2/mês por número
- **USA:** ~$1/mês por número
- **Europa:** ~$1-2/mês por número

### SMS Recebidos:
- **Grátis!** Você não paga para receber SMS

### SMS Enviados (se precisar):
- ~$0.01 por SMS

### Exemplo de Custo:
- 10 números brasileiros: $20/mês
- Receber 1000 SMS: $0
- **Total:** $20/mês

### Sua Margem:
- Cobrar R$ 5 por verificação
- 1000 verificações = R$ 5.000
- Custo: R$ 100 (números)
- **Lucro: R$ 4.900/mês** 🚀

## 🔧 Funcionalidades Implementadas

✅ Buscar números disponíveis no Twilio
✅ Comprar números automaticamente
✅ Configurar webhooks automaticamente
✅ Receber SMS em tempo real
✅ Extrair códigos de verificação automaticamente
✅ Liberar números quando não precisar mais

## 📱 Fluxo Completo

1. **Admin compra número** via Twilio API
2. **Número é adicionado** ao sistema automaticamente
3. **Usuário aluga** o número
4. **WhatsApp envia SMS** para o número
5. **Twilio recebe** e envia para seu webhook
6. **Sistema extrai código** automaticamente
7. **Usuário vê código** no dashboard
8. **Número é liberado** após 20 minutos

## 🆘 Problemas Comuns

### "Twilio não configurado"
- Verifique se copiou corretamente o Account SID e Auth Token
- Certifique-se de que não tem espaços extras no .env

### "Erro ao comprar número"
- Verifique se tem crédito na conta Twilio
- Alguns países exigem verificação de identidade

### "Webhook não funciona"
- Para testes locais, use ngrok
- Certifique-se de que o WEBHOOK_URL está correto no .env
- Reinicie o servidor após mudar o .env

## 🎯 Próximos Passos

1. ✅ Criar conta Twilio
2. ✅ Configurar credenciais no .env
3. ✅ Iniciar servidor: `node server-twilio.js`
4. ✅ Comprar primeiro número
5. ✅ Testar com WhatsApp real!

## 📞 Suporte Twilio

- Documentação: https://www.twilio.com/docs
- Console: https://console.twilio.com
- Suporte: https://support.twilio.com

## 🎉 Pronto!

Agora você tem um sistema completo de números virtuais funcionando com números REAIS do Twilio!
