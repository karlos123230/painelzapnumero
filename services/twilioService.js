const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.client = null;
    
    // Só inicializar se as credenciais forem válidas
    if (this.accountSid && this.authToken && 
        this.accountSid.startsWith('AC') && 
        this.accountSid.length > 30) {
      try {
        this.client = twilio(this.accountSid, this.authToken);
        console.log('✅ Twilio configurado');
      } catch (error) {
        console.log('⚠️  Erro ao configurar Twilio:', error.message);
      }
    } else {
      console.log('⚠️  Twilio não configurado (credenciais ausentes ou inválidas)');
    }
  }

  isConfigured() {
    return this.client !== null;
  }

  // Buscar números disponíveis para compra
  async searchAvailableNumbers(countryCode = 'US', type = 'local') {
    if (!this.isConfigured()) {
      throw new Error('Twilio não configurado');
    }

    try {
      let numbers;
      
      if (type === 'mobile') {
        numbers = await this.client.availablePhoneNumbers(countryCode)
          .mobile
          .list({ limit: 20 });
      } else {
        // Local numbers (mais comum para trial)
        numbers = await this.client.availablePhoneNumbers(countryCode)
          .local
          .list({ limit: 20 });
      }

      return numbers.map(num => ({
        phoneNumber: num.phoneNumber,
        friendlyName: num.friendlyName,
        capabilities: num.capabilities,
        locality: num.locality,
        region: num.region
      }));
    } catch (error) {
      console.error('Erro ao buscar números:', error.message);
      throw error;
    }
  }

  // Comprar número
  async buyNumber(phoneNumber, webhookUrl = null) {
    if (!this.isConfigured()) {
      throw new Error('Twilio não configurado');
    }

    try {
      const config = {
        phoneNumber: phoneNumber
      };
      
      // Só adicionar webhook se for uma URL pública válida
      if (webhookUrl && !webhookUrl.includes('localhost') && webhookUrl.startsWith('http')) {
        config.smsUrl = webhookUrl;
        config.smsMethod = 'POST';
        config.voiceUrl = webhookUrl;
        config.voiceMethod = 'POST';
      }
      
      const purchasedNumber = await this.client.incomingPhoneNumbers.create(config);

      console.log(`✅ Número comprado: ${purchasedNumber.phoneNumber}`);
      return purchasedNumber;
    } catch (error) {
      console.error('Erro ao comprar número:', error.message);
      throw error;
    }
  }

  // Configurar webhook para número existente
  async setupWebhook(phoneNumberSid, webhookUrl) {
    if (!this.isConfigured()) {
      throw new Error('Twilio não configurado');
    }

    try {
      await this.client.incomingPhoneNumbers(phoneNumberSid)
        .update({
          smsUrl: webhookUrl,
          smsMethod: 'POST'
        });

      console.log(`✅ Webhook configurado para ${phoneNumberSid}`);
    } catch (error) {
      console.error('Erro ao configurar webhook:', error.message);
      throw error;
    }
  }

  // Listar números comprados
  async listOwnedNumbers() {
    if (!this.isConfigured()) {
      throw new Error('Twilio não configurado');
    }

    try {
      const numbers = await this.client.incomingPhoneNumbers.list();
      return numbers.map(num => ({
        sid: num.sid,
        phoneNumber: num.phoneNumber,
        friendlyName: num.friendlyName,
        capabilities: num.capabilities,
        smsUrl: num.smsUrl
      }));
    } catch (error) {
      console.error('Erro ao listar números:', error.message);
      throw error;
    }
  }

  // Liberar número
  async releaseNumber(phoneNumberSid) {
    if (!this.isConfigured()) {
      throw new Error('Twilio não configurado');
    }

    try {
      await this.client.incomingPhoneNumbers(phoneNumberSid).remove();
      console.log(`✅ Número liberado: ${phoneNumberSid}`);
    } catch (error) {
      console.error('Erro ao liberar número:', error.message);
      throw error;
    }
  }

  // Validar webhook do Twilio
  validateWebhook(signature, url, params) {
    if (!this.isConfigured()) {
      return false;
    }

    return twilio.validateRequest(
      this.authToken,
      signature,
      url,
      params
    );
  }
}

module.exports = new TwilioService();
