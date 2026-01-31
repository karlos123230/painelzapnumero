const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Listar pedidos do usuário
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('phoneNumber')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
});

// Cancelar pedido
router.post('/cancel/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Pedido já completado' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Pedido cancelado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar pedido' });
  }
});

module.exports = router;
