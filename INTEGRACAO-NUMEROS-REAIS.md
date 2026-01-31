# 📱 Integração com Números Reais

Este guia explica como integrar o painel com provedores reais de números virtuais.

## 🌐 Provedores Recomendados

### 1. Twilio (Mais Popular)
- **Site:** https://www.twilio.com
- **Preço:** A partir de $1/mês por número
- **Países:** 100+ países disponíveis
- **API:** Excelente documentação

### 2. Vonage (Nexmo)
- **Site:** https://www.vonage.com
- **Preço:** Similar ao Twilio
- **Países:** 90+ países
- **API:** Muito boa

### 3. Plivo
- **Site:** https://www.plivo.com
- **Preço:** Geralmente mais barato
- **Países:** 50+ países
- **API:** Simples e eficiente

### 4. MessageBird
- **Site:** https://www.messagebird.com
- **Preço:** Competitivo
- **Países:** 60+ países
- **API:** Moderna

## 🔧 Exemplo de Integração com Twilio

### 1. Instalar SDK do Twilio

```bash
npm install twilio
```

### 2. Criar arquivo `services/twilioService.js`

```javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Comprar número
async function buyNumber(countryCode, areaCode) {
  const numbers = await client.availablePhoneNumbers(countryCode)
    .local
    .list({ areaCode, limit: 1 });

  if (numbers.length > 0) {
    const purchasedNumber = await client.incomingPhoneNumbers
      .create({ phoneNumber: numbers[0].phoneNumber });
    
    return purchasedNumber;
  }
  return null;
}

// Configurar webhook para receber SMS
async function setupWebhook(phoneNumber, webhookUrl) {
  await client.incomingPhoneNumbers
    .list({ phoneNumber })
    .then(numbers => {
      if (numbers.length > 0) {
        return numbers[0].update({
          smsUrl: webhookUrl,
          smsMethod: 'POST'
        });
      }
    });
}

module.exports = { buyNumber, setupWebhook };
```

### 3. Adicionar rota para receber SMS

```javascript
// routes/webhooks.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const PhoneNumber = require('../models/PhoneNumber');

router.post('/twilio/sms', async (req, res) => {
  const { From, To, Body } = req.body;
  
  // Encontrar o número no sistema
  const phoneNumber = await PhoneNumber.findOne({ number: To });
  
  if (phoneNumber && phoneNumber.currentUser) {
    // Encontrar pedido ativo
    const order = await Order.findOne({
      phoneNumber: phoneNumber._id,
      status: 'active'
    });
    
    if (order) {
      // Extrair código de verificação (geralmente 4-6 dígitos)
      const codeMatch = Body.match(/\b\d{4,6}\b/);
      
      if (codeMatch) {
        order.verificationCode = codeMatch[0];
        order.status = 'completed';
      }
      
      order.messages.push({ text: Body });
      await order.save();
    }
  }
  
  res.status(200).send('OK');
});

module.exports = router;
```

### 4. Atualizar `.env`

```
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
WEBHOOK_URL=https://seu-dominio.com/api/webhooks/twilio/sms
```

### 5. Adicionar rota no `server.js`

```javascript
app.use('/api/webhooks', require('./routes/webhooks'));
```

## 🔄 Fluxo Completo

1. **Admin adiciona número:**
   - Sistema compra número via API do provedor
   - Configura webhook para receber SMS
   - Salva no banco de dados

2. **Usuário aluga número:**
   - Sistema marca número como "rented"
   - Cria pedido ativo
   - Aguarda SMS

3. **SMS chega:**
   - Provedor envia para webhook
   - Sistema extrai código de verificação
   - Atualiza pedido
   - Usuário vê código no dashboard

4. **Número expira:**
   - Após 20 minutos, número volta para "available"
   - Pode ser alugado novamente

## 🌐 Expor Webhook Localmente (Para Testes)

Use **ngrok** para testar localmente:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 5000
ngrok http 5000

# Copiar URL gerada (ex: https://abc123.ngrok.io)
# Usar como WEBHOOK_URL
```

## 💰 Custos Estimados

### Twilio (Exemplo)
- Número virtual: $1-2/mês
- SMS recebido: $0.0075 cada
- 1000 verificações/mês: ~$10-15

### Sua Margem
- Cobrar R$ 5 por verificação
- Custo: ~R$ 0.04
- Lucro: R$ 4.96 por verificação (99% de margem!)

## 🔐 Segurança

1. **Validar webhooks:**
```javascript
const twilio = require('twilio');

router.post('/twilio/sms', (req, res) => {
  const signature = req.headers['x-twilio-signature'];
  const url = process.env.WEBHOOK_URL;
  
  if (!twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    req.body
  )) {
    return res.status(403).send('Forbidden');
  }
  
  // Processar SMS...
});
```

2. **Rate limiting:**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requisições
});

app.use('/api/', limiter);
```

## 📊 Monitoramento

Adicione logs para monitorar:
- Números comprados
- SMS recebidos
- Códigos extraídos
- Erros de webhook

## 🚀 Próximos Passos

1. Criar conta no Twilio/Vonage
2. Implementar integração
3. Testar com ngrok
4. Deploy em servidor com domínio
5. Configurar webhooks de produção
6. Monitorar e escalar!

## 📞 Suporte

Para dúvidas sobre APIs:
- Twilio: https://www.twilio.com/docs
- Vonage: https://developer.vonage.com
- Plivo: https://www.plivo.com/docs
