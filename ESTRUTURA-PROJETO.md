# 📁 Estrutura do Projeto

```
sms-panel/
│
├── 📂 client/                          # Frontend React
│   ├── public/
│   │   └── index.html                  # HTML principal
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js               # Barra de navegação
│   │   ├── context/
│   │   │   └── AuthContext.js          # Contexto de autenticação
│   │   ├── pages/
│   │   │   ├── Login.js                # Página de login
│   │   │   ├── Register.js             # Página de registro
│   │   │   ├── Dashboard.js            # Dashboard do usuário
│   │   │   └── AdminPanel.js           # Painel administrativo
│   │   ├── App.js                      # Componente principal
│   │   ├── index.js                    # Entry point
│   │   └── index.css                   # Estilos globais
│   ├── package.json
│   ├── tailwind.config.js              # Config do Tailwind
│   └── postcss.config.js
│
├── 📂 models/                          # Modelos do MongoDB
│   ├── User.js                         # Modelo de usuário
│   ├── PhoneNumber.js                  # Modelo de número virtual
│   └── Order.js                        # Modelo de pedido
│
├── 📂 routes/                          # Rotas da API
│   ├── auth.js                         # Login/Registro
│   ├── numbers.js                      # Gerenciar números
│   ├── orders.js                       # Gerenciar pedidos
│   ├── admin.js                        # Rotas admin
│   └── payments.js                     # Pagamentos (Stripe)
│
├── 📂 middleware/                      # Middlewares
│   ├── auth.js                         # Autenticação JWT
│   └── adminAuth.js                    # Verificar se é admin
│
├── 📂 scripts/                         # Scripts utilitários
│   ├── create-admin.js                 # Criar usuário admin
│   └── seed-numbers.js                 # Popular números de exemplo
│
├── 📄 server.js                        # Servidor Express
├── 📄 package.json                     # Dependências backend
├── 📄 .env                             # Variáveis de ambiente
├── 📄 .env.example                     # Exemplo de .env
├── 📄 .gitignore                       # Arquivos ignorados
│
├── 📄 README.md                        # Documentação principal
├── 📄 INICIO-RAPIDO.md                 # Guia de início rápido
├── 📄 INSTALACAO.md                    # Guia de instalação
├── 📄 INTEGRACAO-NUMEROS-REAIS.md      # Como integrar números reais
├── 📄 ESTRUTURA-PROJETO.md             # Este arquivo
│
├── 🚀 start-backend.bat                # Iniciar backend (Windows)
└── 🚀 start-frontend.bat               # Iniciar frontend (Windows)
```

## 🔑 Arquivos Principais

### Backend

**server.js**
- Ponto de entrada do servidor
- Configura Express, CORS, MongoDB
- Registra todas as rotas

**models/**
- `User.js`: email, senha, saldo, isAdmin
- `PhoneNumber.js`: número, país, preço, status
- `Order.js`: pedido de aluguel, código de verificação

**routes/**
- `auth.js`: POST /register, /login
- `numbers.js`: GET /available, POST /rent/:id, GET /code/:orderId
- `orders.js`: GET /my-orders, POST /cancel/:id
- `admin.js`: POST /numbers, GET /numbers, POST /send-code/:orderId
- `payments.js`: POST /add-credits, POST /webhook

### Frontend

**App.js**
- Configuração de rotas
- Rotas privadas e admin

**pages/**
- `Login.js`: Formulário de login
- `Register.js`: Formulário de registro
- `Dashboard.js`: Lista números, aluga, vê pedidos
- `AdminPanel.js`: Adiciona números, gerencia sistema

**context/AuthContext.js**
- Gerencia estado de autenticação
- Funções: login, register, logout

## 🔄 Fluxo de Dados

### Autenticação
```
Login → POST /api/auth/login → JWT Token → localStorage → Headers
```

### Alugar Número
```
Dashboard → POST /api/numbers/rent/:id → 
Verifica saldo → Deduz valor → Marca número como "rented" → 
Cria Order → Retorna número e pedido
```

### Receber Código
```
Webhook SMS → POST /api/webhooks/twilio/sms → 
Extrai código → Atualiza Order → 
Frontend polling → GET /api/numbers/code/:orderId → 
Mostra código para usuário
```

## 🎨 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Stripe** - Pagamentos

### Frontend
- **React 18** - Biblioteca UI
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **Axios** - Requisições HTTP

## 📊 Modelos de Dados

### User
```javascript
{
  email: String,
  password: String (hashed),
  balance: Number,
  isAdmin: Boolean,
  createdAt: Date
}
```

### PhoneNumber
```javascript
{
  number: String,
  country: String,
  countryCode: String,
  service: String,
  price: Number,
  status: 'available' | 'rented' | 'inactive',
  currentUser: ObjectId,
  rentedUntil: Date,
  createdAt: Date
}
```

### Order
```javascript
{
  user: ObjectId,
  phoneNumber: ObjectId,
  service: String,
  price: Number,
  verificationCode: String,
  status: 'pending' | 'active' | 'completed' | 'cancelled',
  messages: [{ text: String, receivedAt: Date }],
  createdAt: Date,
  expiresAt: Date
}
```

## 🔐 Segurança

- Senhas com hash bcrypt
- JWT para autenticação
- Middleware de autorização
- Validação de admin
- CORS configurado
- Variáveis de ambiente

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Inicia backend com nodemon
npm start            # Inicia backend em produção
npm run client       # Inicia frontend
npm run build        # Build do frontend
npm run create-admin # Cria usuário admin
npm run seed         # Popula números de exemplo
```

## 📱 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login

### Números (Público)
- `GET /api/numbers/available` - Listar disponíveis
- `POST /api/numbers/rent/:id` - Alugar (requer auth)
- `GET /api/numbers/code/:orderId` - Buscar código (requer auth)

### Pedidos (Autenticado)
- `GET /api/orders/my-orders` - Meus pedidos
- `POST /api/orders/cancel/:id` - Cancelar pedido

### Admin (Requer Admin)
- `POST /api/admin/numbers` - Adicionar número
- `GET /api/admin/numbers` - Listar todos
- `PUT /api/admin/numbers/:id` - Atualizar status
- `POST /api/admin/send-code/:orderId` - Enviar código
- `GET /api/admin/stats` - Estatísticas

### Pagamentos (Autenticado)
- `POST /api/payments/add-credits` - Adicionar créditos
- `POST /api/payments/webhook` - Webhook Stripe
