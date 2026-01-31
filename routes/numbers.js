const express = require('express');
const router = express.Router();
const PhoneNumber = require('../models/PhoneNumber');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Listar números disponíveis
router.get('/available', async (req, res) => {
  try {
    const { country, service } = req.query;
    const filter = { status: 'available' };
    if (country) filter.country = country;
    if (service) filter.service = service;

    const numbers = await PhoneNumber.find(filter).select('-currentUser');
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar números' });
  }
});

// Alugar número
router.post('/rent/:id', auth, async (req, res) => {
  try {
    const number = await PhoneNumber.findById(req.params.id);
    if (!number || number.status !== 'available') {
      return res.status(400).json({ message: 'Número não disponível' });
    }

    const user = req.user;
    if (user.balance < number.price) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    user.balance -= number.price;
    await user.save();

    number.status = 'rented';
    number.currentUser = user._id;
    number.rentedUntil = new Date(Date.now() + 20 * 60 * 1000); // 20 minutos
    await number.save();

    const order = new Order({
      user: user._id,
      phoneNumber: number._id,
      service: number.service,
      price: number.price,
      status: 'active',
      expiresAt: number.rentedUntil
    });
    await order.save();

    res.json({ order, number });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao alugar número' });
  }
});

// Buscar código de verificação
router.get('/code/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      user: req.user._id 
    }).populate('phoneNumber');

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json({ 
      verificationCode: order.verificationCode,
      messages: order.messages,
      status: order.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar código' });
  }
});

module.exports = router;
