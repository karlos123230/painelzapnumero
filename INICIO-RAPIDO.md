# 🚀 Início Rápido

## ✅ Status: Dependências Instaladas!

Todas as dependências do Node.js já foram instaladas com sucesso.

## 📋 Checklist Rápido

### 1️⃣ Configure o MongoDB (ESCOLHA UMA OPÇÃO)

**OPÇÃO A - MongoDB Atlas (Recomendado - Mais Fácil!):**
1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie conta gratuita
3. Crie um cluster FREE
4. Copie a string de conexão
5. Cole no arquivo `.env` na linha `MONGODB_URI=`

**OPÇÃO B - MongoDB Local:**
1. Baixe: https://www.mongodb.com/try/download/community
2. Instale no Windows
3. O arquivo `.env` já está configurado para localhost

### 2️⃣ Inicie o Sistema

**Opção 1 - Usando os arquivos .bat (Mais Fácil):**
- Clique duas vezes em `start-backend.bat`
- Abra outro terminal e clique em `start-frontend.bat`

**Opção 2 - Usando comandos:**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 3️⃣ Acesse o Sistema

Abra o navegador em: **http://localhost:3000**

### 4️⃣ Crie sua Conta

1. Clique em "Registrar"
2. Crie sua conta com email e senha

### 5️⃣ Torne-se Admin

Execute no terminal:
```bash
npm run create-admin seu@email.com suasenha
```

### 6️⃣ Adicione Números de Exemplo

Execute no terminal:
```bash
npm run seed
```

Isso vai adicionar 8 números de exemplo de vários países!

### 7️⃣ Pronto! 🎉

Agora você pode:
- Acessar o painel admin em: http://localhost:3000/admin
- Adicionar mais números
- Testar o aluguel de números
- Ver o histórico de pedidos

## 🆘 Precisa de Ajuda?

Veja o arquivo `INSTALACAO.md` para instruções detalhadas.

## 📱 URLs Importantes

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin
- Dashboard: http://localhost:3000/dashboard
