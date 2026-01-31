# Guia de Instalação - Painel SMS/WhatsApp

## ✅ Dependências já instaladas!

As dependências do Node.js já foram instaladas com sucesso.

## 📦 Próximos Passos

### Opção 1: MongoDB Local (Recomendado para desenvolvimento)

1. **Baixe e instale o MongoDB:**
   - Acesse: https://www.mongodb.com/try/download/community
   - Baixe a versão para Windows
   - Execute o instalador e siga as instruções
   - Marque a opção "Install MongoDB as a Service"

2. **Verifique a instalação:**
   ```bash
   mongod --version
   ```

3. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

### Opção 2: MongoDB Atlas (Cloud - Mais Fácil!)

1. **Crie uma conta gratuita:**
   - Acesse: https://www.mongodb.com/cloud/atlas/register
   - Crie uma conta gratuita

2. **Crie um cluster:**
   - Clique em "Build a Database"
   - Escolha o plano FREE (M0)
   - Selecione uma região próxima (ex: São Paulo)

3. **Configure o acesso:**
   - Crie um usuário de banco de dados
   - Adicione seu IP à whitelist (ou use 0.0.0.0/0 para permitir todos)

4. **Copie a string de conexão:**
   - Clique em "Connect"
   - Escolha "Connect your application"
   - Copie a string de conexão (algo como: mongodb+srv://usuario:senha@cluster.mongodb.net/)

5. **Atualize o arquivo `.env`:**
   ```
   MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/sms-panel?retryWrites=true&w=majority
   ```

6. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

## 🚀 Iniciar o Projeto

### Terminal 1 - Backend:
```bash
npm run dev
```

### Terminal 2 - Frontend:
```bash
npm run client
```

## 🔑 Criar Usuário Admin

Após criar sua conta no sistema, execute no MongoDB:

**MongoDB Local (usando mongosh):**
```bash
mongosh
use sms-panel
db.users.updateOne(
  { email: "seu@email.com" },
  { $set: { isAdmin: true } }
)
```

**MongoDB Atlas (usando MongoDB Compass ou Atlas UI):**
1. Acesse o Atlas
2. Clique em "Browse Collections"
3. Selecione o banco "sms-panel" > collection "users"
4. Encontre seu usuário e edite, adicionando: `"isAdmin": true`

## 📱 Acessar o Sistema

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Próximos Passos

1. Registre-se no sistema
2. Torne seu usuário admin (veja acima)
3. Acesse o painel admin
4. Adicione números virtuais
5. Teste o aluguel de números

## 🔧 Configurações Opcionais

### Stripe (Pagamentos)
Para ativar pagamentos reais:
1. Crie uma conta em: https://stripe.com
2. Obtenha suas chaves de API
3. Atualize no arquivo `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
   ```

## ❓ Problemas Comuns

**Erro de conexão com MongoDB:**
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no `.env`

**Porta já em uso:**
- Mude a porta no `.env`: `PORT=5001`

**Erro ao instalar dependências:**
- Delete as pastas `node_modules` e `client/node_modules`
- Execute `npm install` novamente
