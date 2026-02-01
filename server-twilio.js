const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const twilioService = require('./services/twilioService');
const User = require('./models/User');
const PhoneNumber = require('./models/PhoneNumber');
const Order = require('./models/Order');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para webhooks do Twilio

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Middleware de autenticação
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Não autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temp');
    req.user = await User.findById(decoded.userId);
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
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Primeiro usuário é admin
    const userCount = await User.countDocuments();
    const user = new User({
      email,
      password: hashedPassword,
      balance: 100,
      isAdmin: userCount === 0
    });
    
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret_key_temp');
    res.json({ 
      token, 
      user: { id: user._id, email: user.email, balance: user.balance, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret_key_temp');
    res.json({ 
      token, 
      user: { id: user._id, email: user.email, balance: user.balance, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// ============= ROTAS DE NÚMEROS =============

app.get('/api/numbers/available', async (req, res) => {
  try {
    const { country } = req.query;
    let query = { status: 'available' };
    
    if (country) {
      query.country = country;
    }
    
    const available = await PhoneNumber.find(query);
    res.json(available);
  } catch (error) {
    console.error('Erro ao buscar números:', error);
    res.status(500).json({ message: 'Erro ao buscar números' });
  }
});

app.post('/api/numbers/rent/:id', auth, async (req, res) => {
  try {
    const number = await PhoneNumber.findById(req.params.id);

    if (!number || number.status !== 'available') {
      return res.status(400).json({ message: 'Número não disponível' });
    }

    if (req.user.balance < number.price) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    req.user.balance -= number.price;
    await req.user.save();

    number.status = 'rented';
    number.currentUser = req.user._id;
    number.rentedUntil = new Date(Date.now() + 20 * 60 * 1000); // 20 minutos
    await number.save();

    const order = new Order({
      user: req.user._id,
      phoneNumber: number._id,
      service: number.service,
      price: number.price,
      status: 'active',
      expiresAt: number.rentedUntil
    });
    await order.save();

    res.json({ 
      order: {
        id: order._id,
        userId: order.user,
        numberId: order.phoneNumber,
        number: number.number,
        price: order.price,
        status: order.status,
        verificationCode: order.verificationCode,
        messages: order.messages,
        createdAt: order.createdAt,
        expiresAt: order.expiresAt
      }, 
      number 
    });
  } catch (error) {
    console.error('Erro ao alugar número:', error);
    res.status(500).json({ message: 'Erro ao alugar número' });
  }
});

app.get('/api/numbers/code/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      user: req.user._id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json({
      verificationCode: order.verificationCode,
      messages: order.messages,
      status: order.status
    });
  } catch (error) {
    console.error('Erro ao buscar código:', error);
    res.status(500).json({ message: 'Erro ao buscar código' });
  }
});

// ============= ROTAS DE PEDIDOS =============

app.get('/api/orders/my-orders', auth, async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.user._id })
      .populate('phoneNumber')
      .sort({ createdAt: -1 });
    
    // Formatar resposta para compatibilidade com frontend
    const formattedOrders = userOrders.map(order => ({
      id: order._id,
      userId: order.user,
      numberId: order.phoneNumber?._id,
      number: order.phoneNumber?.number,
      price: order.price,
      status: order.status,
      verificationCode: order.verificationCode,
      messages: order.messages,
      createdAt: order.createdAt,
      expiresAt: order.expiresAt
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
});

app.post('/api/orders/cancel/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Pedido já completado' });
    }

    order.status = 'cancelled';
    await order.save();
    
    const number = await PhoneNumber.findById(order.phoneNumber);
    if (number) {
      number.status = 'available';
      number.currentUser = null;
      number.rentedUntil = null;
      await number.save();
    }

    res.json({ message: 'Pedido cancelado' });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({ message: 'Erro ao cancelar pedido' });
  }
});

// ============= ROTAS ADMIN =============

app.get('/api/admin/numbers', [auth, adminAuth], async (req, res) => {
  try {
    const allNumbers = await PhoneNumber.find().sort({ createdAt: -1 });
    res.json(allNumbers);
  } catch (error) {
    console.error('Erro ao buscar números:', error);
    res.status(500).json({ message: 'Erro ao buscar números' });
  }
});

app.post('/api/admin/numbers', [auth, adminAuth], async (req, res) => {
  try {
    const { number, country, countryCode, price, service, twilioSid } = req.body;
    
    const newNumber = new PhoneNumber({
      number,
      country,
      countryCode,
      price: parseFloat(price),
      service: service || 'whatsapp',
      status: 'available',
      twilioSid: twilioSid || null
    });
    
    await newNumber.save();
    res.json(newNumber);
  } catch (error) {
    console.error('Erro ao adicionar número:', error);
    res.status(500).json({ message: 'Erro ao adicionar número' });
  }
});

app.post('/api/admin/send-code/:orderId', [auth, adminAuth], async (req, res) => {
  try {
    const { code, message } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    order.verificationCode = code;
    order.messages.push({ text: message, receivedAt: new Date() });
    order.status = 'completed';
    await order.save();

    res.json({ message: 'Código enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    res.status(500).json({ message: 'Erro ao enviar código' });
  }
});

app.get('/api/admin/stats', [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNumbers = await PhoneNumber.countDocuments();
    const activeOrders = await Order.countDocuments({ status: 'active' });
    
    const completedOrders = await Order.find({ status: 'completed' });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);

    res.json({
      totalUsers,
      totalNumbers,
      activeOrders,
      totalRevenue
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
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
    
    const newNumber = new PhoneNumber({
      number: phoneNumber,
      country: country || 'Brasil',
      countryCode: countryCode || '55',
      price: parseFloat(price) || 5.00,
      service: 'whatsapp',
      status: 'available',
      twilioSid: purchased.sid
    });
    
    await newNumber.save();
    res.json({ message: 'Número comprado com sucesso', number: newNumber });
  } catch (error) {
    console.error('Erro ao comprar número:', error);
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

app.post('/api/webhooks/twilio/sms', async (req, res) => {
  try {
    const { From, To, Body, MessageSid } = req.body;
    
    console.log(`📱 SMS recebido de ${From} para ${To}: ${Body}`);
    
    // Encontrar o número no sistema
    const number = await PhoneNumber.findOne({ 
      $or: [
        { number: To },
        { number: `+${To}` }
      ]
    });
    
    if (number && number.currentUser) {
      // Encontrar pedido ativo
      const order = await Order.findOne({ 
        phoneNumber: number._id,
        status: 'active'
      });
      
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
        
        await order.save();
        console.log(`✅ SMS processado para pedido ${order._id}`);
      }
    }
    
    // Responder ao Twilio
    res.type('text/xml');
    res.send('<Response></Response>');
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.type('text/xml');
    res.send('<Response></Response>');
  }
});

// ============= HEALTH CHECK =============

app.get('/api/health', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const numberCount = await PhoneNumber.countDocuments();
    const orderCount = await Order.countDocuments();
    
    res.json({ 
      status: 'ok', 
      message: 'Servidor funcionando!',
      mongodb: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
      twilio: twilioService.isConfigured() ? 'configurado' : 'não configurado',
      users: userCount,
      numbers: numberCount,
      orders: orderCount
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
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
