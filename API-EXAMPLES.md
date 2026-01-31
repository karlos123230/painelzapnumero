# 📡 Exemplos de Uso da API

## 🔑 Autenticação

### Registrar Novo Usuário

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@exemplo.com",
    "balance": 0
  }
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

## 📱 Números Virtuais

### Listar Números Disponíveis

```bash
curl http://localhost:5000/api/numbers/available
```

**Com filtros:**
```bash
curl "http://localhost:5000/api/numbers/available?country=Brasil&service=whatsapp"
```

**Resposta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "number": "+5511987654321",
    "country": "Brasil",
    "countryCode": "55",
    "service": "whatsapp",
    "price": 5.00,
    "status": "available"
  }
]
```

### Alugar Número

```bash
curl -X POST http://localhost:5000/api/numbers/rent/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Resposta:**
```json
{
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439010",
    "phoneNumber": "507f1f77bcf86cd799439011",
    "service": "whatsapp",
    "price": 5.00,
    "status": "active",
    "expiresAt": "2024-01-31T15:20:00.000Z"
  },
  "number": {
    "_id": "507f1f77bcf86cd799439011",
    "number": "+5511987654321",
    "status": "rented"
  }
}
```

### Buscar Código de Verificação

```bash
curl http://localhost:5000/api/numbers/code/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (quando código chega):**
```json
{
  "verificationCode": "123456",
  "messages": [
    {
      "text": "Seu código do WhatsApp: 123456",
      "receivedAt": "2024-01-31T15:05:00.000Z"
    }
  ],
  "status": "completed"
}
```

## 📋 Pedidos

### Meus Pedidos

```bash
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "phoneNumber": {
      "number": "+5511987654321",
      "country": "Brasil"
    },
    "service": "whatsapp",
    "price": 5.00,
    "verificationCode": "123456",
    "status": "completed",
    "createdAt": "2024-01-31T15:00:00.000Z"
  }
]
```

### Cancelar Pedido

```bash
curl -X POST http://localhost:5000/api/orders/cancel/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 👑 Admin (Requer isAdmin: true)

### Adicionar Número

```bash
curl -X POST http://localhost:5000/api/admin/numbers \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "+5511999999999",
    "country": "Brasil",
    "countryCode": "55",
    "price": 5.00,
    "service": "whatsapp"
  }'
```

### Listar Todos os Números

```bash
curl http://localhost:5000/api/admin/numbers \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

### Atualizar Status do Número

```bash
curl -X PUT http://localhost:5000/api/admin/numbers/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

### Enviar Código Manualmente

```bash
curl -X POST http://localhost:5000/api/admin/send-code/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456",
    "message": "Seu código do WhatsApp: 123456"
  }'
```

### Estatísticas

```bash
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Resposta:**
```json
{
  "totalUsers": 150,
  "totalNumbers": 25,
  "activeOrders": 8,
  "totalRevenue": 2500.00
}
```

## 💳 Pagamentos

### Adicionar Créditos

```bash
curl -X POST http://localhost:5000/api/payments/add-credits \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000
  }'
```

**Resposta:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

## 🔗 Exemplos em JavaScript

### Registrar e Fazer Login

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function register(email, password) {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password
  });
  return response.data;
}

async function login(email, password) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
}

// Uso
const user = await register('teste@exemplo.com', 'senha123');
console.log('Token:', user.token);
```

### Alugar Número e Buscar Código

```javascript
async function rentNumber(token, numberId) {
  const response = await axios.post(
    `${API_URL}/numbers/rent/${numberId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
}

async function getCode(token, orderId) {
  const response = await axios.get(
    `${API_URL}/numbers/code/${orderId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
}

// Uso
const rental = await rentNumber(token, '507f1f77bcf86cd799439011');
console.log('Número alugado:', rental.number.number);

// Polling para buscar código
const checkCode = setInterval(async () => {
  const result = await getCode(token, rental.order._id);
  
  if (result.verificationCode) {
    console.log('Código recebido:', result.verificationCode);
    clearInterval(checkCode);
  }
}, 5000); // Verifica a cada 5 segundos
```

### Fluxo Completo

```javascript
async function verificarWhatsApp() {
  try {
    // 1. Registrar/Login
    const { token } = await login('usuario@exemplo.com', 'senha123');
    
    // 2. Listar números disponíveis
    const numbers = await axios.get(`${API_URL}/numbers/available?country=Brasil`);
    const number = numbers.data[0];
    
    console.log(`Número disponível: ${number.number} - R$ ${number.price}`);
    
    // 3. Alugar número
    const rental = await rentNumber(token, number._id);
    console.log(`Número alugado: ${rental.number.number}`);
    console.log(`Use este número no WhatsApp`);
    
    // 4. Aguardar código
    console.log('Aguardando código...');
    
    let attempts = 0;
    const maxAttempts = 24; // 2 minutos (24 * 5s)
    
    const checkCode = setInterval(async () => {
      attempts++;
      
      const result = await getCode(token, rental.order._id);
      
      if (result.verificationCode) {
        console.log(`✅ Código recebido: ${result.verificationCode}`);
        console.log(`Mensagem: ${result.messages[0].text}`);
        clearInterval(checkCode);
      } else if (attempts >= maxAttempts) {
        console.log('❌ Timeout: código não recebido');
        clearInterval(checkCode);
      } else {
        console.log(`Tentativa ${attempts}/${maxAttempts}...`);
      }
    }, 5000);
    
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

verificarWhatsApp();
```

## 🐍 Exemplos em Python

```python
import requests
import time

API_URL = 'http://localhost:5000/api'

def login(email, password):
    response = requests.post(f'{API_URL}/auth/login', json={
        'email': email,
        'password': password
    })
    return response.json()

def rent_number(token, number_id):
    response = requests.post(
        f'{API_URL}/numbers/rent/{number_id}',
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()

def get_code(token, order_id):
    response = requests.get(
        f'{API_URL}/numbers/code/{order_id}',
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()

# Uso
user = login('usuario@exemplo.com', 'senha123')
token = user['token']

# Listar números
numbers = requests.get(f'{API_URL}/numbers/available').json()
number = numbers[0]

print(f"Número: {number['number']} - R$ {number['price']}")

# Alugar
rental = rent_number(token, number['_id'])
print(f"Alugado: {rental['number']['number']}")

# Aguardar código
print("Aguardando código...")
for i in range(24):  # 2 minutos
    result = get_code(token, rental['order']['_id'])
    
    if result.get('verificationCode'):
        print(f"✅ Código: {result['verificationCode']}")
        break
    
    print(f"Tentativa {i+1}/24...")
    time.sleep(5)
```

## 🔌 Webhook do Twilio

### Receber SMS

```javascript
// routes/webhooks.js
router.post('/twilio/sms', async (req, res) => {
  const { From, To, Body } = req.body;
  
  console.log(`SMS de ${From} para ${To}: ${Body}`);
  
  // Processar SMS...
  
  res.status(200).send('OK');
});
```

### Testar Webhook Localmente

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Expor com ngrok
ngrok http 5000

# Usar URL do ngrok no Twilio:
# https://abc123.ngrok.io/api/webhooks/twilio/sms
```

## 📊 Códigos de Status HTTP

```
200 - OK
201 - Created
400 - Bad Request (dados inválidos)
401 - Unauthorized (sem token ou token inválido)
403 - Forbidden (não é admin)
404 - Not Found
500 - Internal Server Error
```

## 🔒 Headers Necessários

```
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

## 💡 Dicas

1. **Sempre salve o token** após login/registro
2. **Use polling** para buscar código (a cada 5s)
3. **Trate erros** adequadamente
4. **Verifique saldo** antes de alugar
5. **Timeout** após 2 minutos sem código
