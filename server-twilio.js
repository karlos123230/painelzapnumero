const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const twilioService = require('./services/twilioService');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para webhooks do Twilio

// Banco de dados em memória
const users = [];
const numbers = []; // Vazio - números serão comprados do Twilio
const orders = [];

// Middleware de autenticação
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Não autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temp');
    req.user = users.find(u => u.id === decoded.userId);
    if (!req.user) return res.status(401).json({ message: 'Usuário não encontrado' });
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware admin
const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado - Admin apenas' });
  }
  next();
};

// ============= ROTAS DE AUTENTICAÇÃO =============

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      balance: 100,
      isAdmin: users.length === 0
    };
    
    users.push(user);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret_key_temp');
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, balance: user.balance, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret_key_temp');
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, balance: user.balance, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// ============= ROTAS DE NÚMEROS =============

app.get('/api/numbers/available', (req, res) => {
  const { country } = req.query;
  let available = numbers.filter(n => n.status === 'available');
  
  if (country) {
    available = available.filter(n => n.country === country);
  }
  
  res.json(available);
});

app.post('/api/numbers/rent/:id', auth, (req, res) => {
  const number = numbers.find(n => n.id === req.params.id);

  if (!number || number.status !== 'available') {
    return res.status(400).json({ message: 'Número não disponível' });
  }

  if (req.user.balance < number.price) {
    return res.status(400).json({ message: 'Saldo insuficiente' });
  }

  req.user.balance -= number.price;
  number.status = 'rented';
  number.rentedBy = req.user.id;
  number.rentedUntil = new Date(Date.now() + 20 * 60 * 1000); // 20 minutos

  const order = {
    id: String(orders.length + 1),
    userId: req.user.id,
    numberId: number.id,
    number: number.number,
    price: number.price,
    status: 'active',
    verificationCode: null,
    messages: [],
    createdAt: new Date(),
    expiresAt: number.rentedUntil
  };
  orders.push(order);

  res.json({ order, number });
});

app.get('/api/numbers/code/:orderId', auth, (req, res) => {
  const order = orders.find(o => o.id === req.params.orderId && o.userId === req.user.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Pedido não encontrado' });
  }

  res.json({
    verificationCode: order.verificationCode,
    messages: order.messages,
    status: order.status
  });
});

// ============= ROTAS DE PEDIDOS =============

app.get('/api/orders/my-orders', auth, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

app.post('/api/orders/cancel/:id', auth, (req, res) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Pedido não encontrado' });
  }

  if (order.status === 'completed') {
    return res.status(400).json({ message: 'Pedido já completado' });
  }

  order.status = 'cancelled';
  
  const number = numbers.find(n => n.id === order.numberId);
  if (number) {
    number.status = 'available';
    number.rentedBy = null;
  }

  res.json({ message: 'Pedido cancelado' });
});

// ============= ROTAS ADMIN =============

app.get('/api/admin/numbers', [auth, adminAuth], (req, res) => {
  res.json(numbers);
});

app.post('/api/admin/numbers', [auth, adminAuth], (req, res) => {
  const { number, country, countryCode, price, service } = req.body;
  
  const newNumber = {
    id: String(numbers.length + 1),
    number,
    country,
    countryCode,
    price: parseFloat(price),
    service: service || 'whatsapp',
    status: 'available',
    twilioSid: null
  };
  
  numbers.push(newNumber);
  res.json(newNumber);
});

app.post('/api/admin/send-code/:orderId', [auth, adminAuth], (req, res) => {
  const { code, message } = req.body;
  const order = orders.find(o => o.id === req.params.orderId);
  
  if (!order) {
    return res.status(404).json({ message: 'Pedido não encontrado' });
  }

  order.verificationCode = code;
  order.messages.push({ text: message, receivedAt: new Date() });
  order.status = 'completed';

  res.json({ message: 'Código enviado com sucesso' });
});

app.get('/api/admin/stats', [auth, adminAuth], (req, res) => {
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0);

  res.json({
    totalUsers: users.length,
    totalNumbers: numbers.length,
    activeOrders: orders.filter(o => o.status === 'active').length,
    totalRevenue
  });
});

// ============= ROTAS TWILIO =============

// Buscar números disponíveis no Twilio
app.get('/api/twilio/search-numbers', [auth, adminAuth], async (req, res) => {
  try {
    const { countryCode } = req.query;
    const availableNumbers = await twilioService.searchAvailableNumbers(countryCode || 'BR');
    res.json(availableNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Comprar número do Twilio
app.post('/api/twilio/buy-number', [auth, adminAuth], async (req, res) => {
  try {
    const { phoneNumber, country, countryCode, price } = req.body;
    const webhookUrl = `${process.env.WEBHOOK_URL || 'http://localhost:5000'}/api/webhooks/twilio/sms`;
    
    const purchased = await twilioService.buyNumber(phoneNumber, webhookUrl);
    
    const newNumber = {
      id: String(numbers.length + 1),
      number: phoneNumber,
      country: country || 'Brasil',
      countryCode: countryCode || '55',
      price: parseFloat(price) || 5.00,
      service: 'whatsapp',
      status: 'available',
      twilioSid: purchased.sid
    };
    
    numbers.push(newNumber);
    res.json({ message: 'Número comprado com sucesso', number: newNumber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listar números do Twilio
app.get('/api/twilio/owned-numbers', [auth, adminAuth], async (req, res) => {
  try {
    const ownedNumbers = await twilioService.listOwnedNumbers();
    res.json(ownedNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= WEBHOOK TWILIO =============

app.post('/api/webhooks/twilio/sms', (req, res) => {
  const { From, To, Body, MessageSid } = req.body;
  
  console.log(`📱 SMS recebido de ${From} para ${To}: ${Body}`);
  
  // Encontrar o número no sistema
  const number = numbers.find(n => n.number === To || n.number === `+${To}`);
  
  if (number && number.rentedBy) {
    // Encontrar pedido ativo
    const order = orders.find(o => 
      o.numberId === number.id && 
      o.status === 'active'
    );
    
    if (order) {
      // Extrair código de verificação (4-6 dígitos)
      const codeMatch = Body.match(/\b\d{4,6}\b/);
      
      if (codeMatch) {
        order.verificationCode = codeMatch[0];
        order.status = 'completed';
        console.log(`✅ Código extraído: ${codeMatch[0]}`);
      }
      
      order.messages.push({ 
        text: Body, 
        from: From,
        receivedAt: new Date(),
        messageSid: MessageSid
      });
      
      console.log(`✅ SMS processado para pedido ${order.id}`);
    }
  }
  
  // Responder ao Twilio
  res.type('text/xml');
  res.send('<Response></Response>');
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando!',
    twilio: twilioService.isConfigured() ? 'configurado' : 'não configurado',
    users: users.length,
    numbers: numbers.length,
    orders: orders.length
  });
});

// ============= INICIAR SERVIDOR =============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:3000`);
  console.log(`📊 Twilio: ${twilioService.isConfigured() ? 'Configurado ✅' : 'Não configurado ⚠️'}`);
  
  if (!twilioService.isConfigured()) {
    console.log('\n⚠️  Para usar números reais do Twilio:');
    console.log('1. Crie conta em: https://www.twilio.com/try-twilio');
    console.log('2. Adicione no .env:');
    console.log('   TWILIO_ACCOUNT_SID=seu_account_sid');
    console.log('   TWILIO_AUTH_TOKEN=seu_auth_token');
    console.log('   WEBHOOK_URL=https://seu-dominio.com (ou use ngrok)');
  }
});
