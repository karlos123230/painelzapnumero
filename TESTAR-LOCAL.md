# 🏠 Testar Localmente

## 🚀 Como Rodar o Sistema Localmente

### 1️⃣ Instalar Dependências

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 2️⃣ Configurar .env

Certifique-se que o arquivo `.env` na raiz tem:

```env
PORT=5000
MONGODB_URI=mongodb+srv://musicoterapeutakarlos_db_user:aTtgtupoXqc0Y36k@cluster0.iyjxx0b.mongodb.net/sms-panel?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta_super_segura_aqui_12345_mude_isso_em_producao
FRONTEND_URL=http://localhost:3000
WEBHOOK_URL=http://localhost:5000
TWILIO_ACCOUNT_SID=AC7ec...seu_sid_aqui
TWILIO_AUTH_TOKEN=8fa74...seu_token_aqui
```

### 3️⃣ Iniciar Backend

**Opção 1: Usando os scripts .bat (Windows)**
```bash
start-backend.bat
```

**Opção 2: Comando direto**
```bash
node server-twilio.js
```

Você deve ver:
```
✅ MongoDB conectado
✅ Servidor rodando na porta 5000
🌐 Frontend: http://localhost:3000
📊 Twilio: Configurado ✅
```

### 4️⃣ Iniciar Frontend (em outro terminal)

**Opção 1: Usando os scripts .bat (Windows)**
```bash
start-frontend.bat
```

**Opção 2: Comando direto**
```bash
cd client
npm start
```

O navegador deve abrir automaticamente em `http://localhost:3000`

### 5️⃣ Testar

1. Registre uma conta
2. Faça login
3. Vá no Admin Panel (primeiro usuário é admin)
4. Compre números do Twilio

## ⚠️ PROBLEMAS COMUNS

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
npm install
cd client
npm install
```

### Erro: "Port 5000 already in use"
```bash
# Windows: Matar processo na porta 5000
netstat -ano | findstr :5000
taskkill /PID [número_do_pid] /F

# Ou mudar a porta no .env
PORT=5001
```

### Erro: "MongoDB connection failed"
- Verifique se a string MONGODB_URI está correta
- Confirme que o IP está liberado no MongoDB Atlas
- Teste a conexão: `node test-connection.js`

### Frontend não conecta ao backend
- Verifique se o backend está rodando na porta 5000
- Teste: http://localhost:5000/api/health
- Deve retornar JSON com status "ok"

### Erro 404 nas rotas da API
- Certifique-se que está usando `server-twilio.js` e não `server.js`
- Verifique se o backend iniciou sem erros

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### Teste 1: Backend Health
Abra no navegador:
```
http://localhost:5000/api/health
```

Deve mostrar:
```json
{
  "status": "ok",
  "mongodb": "conectado",
  "twilio": "configurado"
}
```

### Teste 2: Frontend
Abra no navegador:
```
http://localhost:3000
```

Deve mostrar a página de login/registro

### Teste 3: Console do Backend
No terminal do backend, você deve ver:
```
✅ MongoDB conectado
✅ Servidor rodando na porta 5000
```

### Teste 4: Console do Frontend
No terminal do frontend, você deve ver:
```
Compiled successfully!
webpack compiled with 0 warnings
```

## 🎯 FLUXO COMPLETO DE TESTE

1. **Registrar usuário:**
   - Email: admin@teste.com
   - Senha: 123456
   - Primeiro usuário é automaticamente admin

2. **Fazer login:**
   - Use as mesmas credenciais

3. **Ir no Admin Panel:**
   - Clique em "Admin Panel" no menu

4. **Buscar números do Twilio:**
   - Aba "Twilio - Buy Numbers"
   - Selecione país (US, BR, etc)
   - Clique em "Search Numbers"

5. **Comprar número:**
   - Clique em "Buy" em um número disponível
   - Aguarde confirmação

6. **Ver números comprados:**
   - Aba "Numbers Registered"
   - Deve mostrar o número comprado

7. **Testar como usuário normal:**
   - Logout
   - Registre outro usuário
   - Vá no Dashboard
   - Alugue um número
   - Envie SMS para ele
   - Veja o código aparecer

## 📝 SCRIPTS DISPONÍVEIS

### Backend
```bash
npm run dev          # Rodar com nodemon (auto-reload)
npm start            # Rodar normalmente
node server-twilio.js # Rodar diretamente
```

### Frontend
```bash
cd client
npm start            # Desenvolvimento
npm run build        # Build para produção
```

### Utilitários
```bash
node test-connection.js    # Testar conexão MongoDB
node test-twilio.js        # Testar credenciais Twilio
node scripts/create-admin.js  # Criar usuário admin
```

## 🔄 REINICIAR TUDO

Se algo der errado:

```bash
# Parar todos os processos (Ctrl+C em cada terminal)

# Limpar node_modules
rmdir /s /q node_modules
rmdir /s /q client\node_modules

# Reinstalar
npm install
cd client
npm install
cd ..

# Iniciar novamente
node server-twilio.js
# Em outro terminal:
cd client
npm start
```

---

**Dica:** Use dois terminais separados - um para backend, outro para frontend. Assim você vê os logs de ambos simultaneamente.
