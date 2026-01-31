# 📱 Painel de Números Virtuais - WhatsApp/SMS

Sistema completo para gerenciar e alugar números virtuais para verificação de WhatsApp e outros serviços, similar ao SMSBear.

## ✨ Funcionalidades

- ✅ Sistema de autenticação completo
- ✅ Painel de usuário para alugar números
- ✅ Painel administrativo
- ✅ Sistema de créditos e pagamentos (Stripe)
- ✅ Suporte a múltiplos países
- ✅ Expiração automática (20 minutos)
- ✅ Histórico de pedidos
- ✅ API REST completa

## 🚀 Início Rápido

### ✅ Dependências já instaladas!

As dependências do Node.js já foram instaladas. Siga os próximos passos:

### 1️⃣ Configure o MongoDB

**Opção A - MongoDB Atlas (Recomendado):**
1. Crie conta gratuita em: https://www.mongodb.com/cloud/atlas/register
2. Crie um cluster FREE
3. Copie a string de conexão
4. Cole no arquivo `.env`

**Opção B - MongoDB Local:**
1. Baixe: https://www.mongodb.com/try/download/community
2. Instale no Windows
3. O `.env` já está configurado

### 2️⃣ Inicie o Sistema

**Windows (Mais Fácil):**
- Clique em `start-backend.bat`
- Clique em `start-frontend.bat`

**Ou via terminal:**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

### 3️⃣ Acesse o Sistema

Abra: **http://localhost:3000**

### 4️⃣ Crie Usuário Admin

```bash
npm run create-admin seu@email.com suasenha
```

### 5️⃣ Adicione Números de Exemplo

```bash
npm run seed
```

## 📚 Documentação Completa

- **[INICIO-RAPIDO.md](INICIO-RAPIDO.md)** - Guia de início rápido
- **[INSTALACAO.md](INSTALACAO.md)** - Instalação detalhada
- **[ESTRUTURA-PROJETO.md](ESTRUTURA-PROJETO.md)** - Estrutura do código
- **[API-EXAMPLES.md](API-EXAMPLES.md)** - Exemplos de uso da API
- **[INTEGRACAO-NUMEROS-REAIS.md](INTEGRACAO-NUMEROS-REAIS.md)** - Como integrar Twilio/Vonage
- **[MONETIZACAO.md](MONETIZACAO.md)** - Estratégias de monetização
- **[DEPLOY.md](DEPLOY.md)** - Como fazer deploy

## 🛠️ Tecnologias

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Stripe

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios

## 📊 Estrutura

```
├── client/              # Frontend React
├── models/              # Modelos MongoDB
├── routes/              # Rotas da API
├── middleware/          # Autenticação
├── scripts/             # Scripts úteis
└── server.js            # Servidor Express
```

## 🔑 Scripts Disponíveis

```bash
npm run dev              # Inicia backend
npm run client           # Inicia frontend
npm run create-admin     # Cria usuário admin
npm run seed             # Adiciona números de exemplo
```

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

## 💰 Potencial de Lucro

Com 100 verificações/dia:
- **Receita:** R$ 15.000/mês
- **Custos:** R$ 1.000/mês
- **Lucro:** R$ 14.000/mês

Veja mais em [MONETIZACAO.md](MONETIZACAO.md)

## 🔗 Próximos Passos

1. ✅ Sistema base funcionando
2. 🔄 Integrar Twilio/Vonage para números reais
3. 🔄 Configurar webhooks para receber SMS
4. 🔄 Deploy em produção
5. 🔄 Marketing e crescimento

## 📞 Suporte

Dúvidas? Veja a documentação completa nos arquivos .md

## 📄 Licença

MIT
