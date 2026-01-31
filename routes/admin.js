const express = require('express');
const router = express.Router();
const PhoneNumber = require('../models/PhoneNumber');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Adicionar novo número
router.post('/numbers', [auth, adminAuth], async (req, res) => {
  try {
    const { number, country, countryCode, price, service } = req.body;
    
    const phoneNumber = new PhoneNumber({
      number,
      country,
      countryCode,
      price,
      service
    });
    
    await phoneNumber.save();
    res.json(phoneNumber);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar número' });
  }
});

// Listar todos os números
router.get('/numbers', [auth, adminAuth], async (req, res) => {
  try {
    const numbers = await PhoneNumber.find().populate('currentUser', 'email');
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar números' });
  }
});

// Atualizar status do número
router.put('/numbers/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;
    const number = await PhoneNumber.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(number);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar número' });
  }
});

// Enviar SMS/código para pedido
router.post('/send-code/:orderId', [auth, adminAuth], async (req, res) => {
  try {
    const { code, message } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    order.verificationCode = code;
    order.messages.push({ text: message });
    order.status = 'completed';
    await order.save();

    res.json({ message: 'Código enviado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar código' });
  }
});

// Dashboard stats
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNumbers = await PhoneNumber.countDocuments();
    const activeOrders = await Order.countDocuments({ status: 'active' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      totalUsers,
      totalNumbers,
      activeOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;
