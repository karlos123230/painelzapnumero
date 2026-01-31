const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB (opcional para teste)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.log('⚠️  MongoDB não conectado, rodando em modo de demonstração');
    console.log('Erro:', err.message);
  });

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/numbers', require('./routes/numbers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando!',
    mongodb: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
