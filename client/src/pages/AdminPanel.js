import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [numbers, setNumbers] = useState([]);
  const [twilioNumbers, setTwilioNumbers] = useState([]);
  const [ownedNumbers, setOwnedNumbers] = useState([]);
  const [form, setForm] = useState({ number: '', country: '', countryCode: '', price: '', service: 'whatsapp' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('numbers');
  const [searchCountry, setSearchCountry] = useState('US');

  useEffect(() => {
    loadNumbers();
  }, []);

  const loadNumbers = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/numbers');
    setNumbers(res.data);
  };

  const addNumber = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/admin/numbers', form);
    setForm({ number: '', country: '', countryCode: '', price: '', service: 'whatsapp' });
    loadNumbers();
  };

  const searchTwilioNumbers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/twilio/search-numbers?countryCode=${searchCountry}`);
      setTwilioNumbers(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao buscar números');
    }
    setLoading(false);
  };

  const loadOwnedNumbers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/twilio/owned-numbers');
      setOwnedNumbers(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao buscar números');
    }
    setLoading(false);
  };

  const buyTwilioNumber = async (phoneNumber) => {
    if (!window.confirm(`Comprar número ${phoneNumber}?\nCusto: ~$1/mês`)) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/twilio/buy-number', {
        phoneNumber,
        country: searchCountry === 'US' ? 'USA' : 'Brasil',
        countryCode: searchCountry === 'US' ? '1' : '55',
        price: 8.00
      });
      alert('Número comprado com sucesso!');
      loadNumbers();
      setTwilioNumbers([]);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao comprar número');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Admin</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button 
          onClick={() => setActiveTab('numbers')}
          className={`pb-2 px-4 ${activeTab === 'numbers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
          Números Cadastrados
        </button>
        <button 
          onClick={() => setActiveTab('twilio')}
          className={`pb-2 px-4 ${activeTab === 'twilio' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
          Twilio - Comprar Números
        </button>
        <button 
          onClick={() => setActiveTab('manual')}
          className={`pb-2 px-4 ${activeTab === 'manual' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
          Adicionar Manual
        </button>
      </div>

      {/* Tab: Números Cadastrados */}
      {activeTab === 'numbers' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Números no Sistema ({numbers.length})</h2>
          <div className="space-y-2">
            {numbers.map(num => (
              <div key={num.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                <div>
                  <span className="font-bold">{num.number}</span>
                  <span className="text-gray-600 ml-4">{num.country}</span>
                  <span className="text-green-600 ml-4">R$ {num.price}</span>
                  {num.twilioSid && <span className="ml-4 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Twilio</span>}
                </div>
                <span className={`px-3 py-1 rounded text-sm ${
                  num.status === 'available' ? 'bg-green-100 text-green-800' : 
                  num.status === 'rented' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {num.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Twilio */}
      {activeTab === 'twilio' && (
        <div className="space-y-6">
          {/* Buscar Números */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Buscar Números Disponíveis no Twilio</h2>
            <div className="flex gap-4 mb-4">
              <select 
                className="p-2 border rounded"
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}>
                <option value="US">Estados Unidos</option>
                <option value="BR">Brasil</option>
                <option value="GB">Reino Unido</option>
                <option value="CA">Canadá</option>
              </select>
              <button 
                onClick={searchTwilioNumbers}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Buscando...' : 'Buscar Números'}
              </button>
              <button 
                onClick={loadOwnedNumbers}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400">
                Ver Meus Números
              </button>
            </div>

            {twilioNumbers.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-3">Números Disponíveis ({twilioNumbers.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {twilioNumbers.map((num, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                      <div>
                        <span className="font-bold">{num.phoneNumber}</span>
                        <span className="text-gray-600 ml-4">{num.locality}, {num.region}</span>
                        <span className="text-xs ml-4">
                          SMS: {num.capabilities?.sms ? '✅' : '❌'} | 
                          Voice: {num.capabilities?.voice ? '✅' : '❌'} | 
                          MMS: {num.capabilities?.mms ? '✅' : '❌'}
                        </span>
                      </div>
                      <button 
                        onClick={() => buyTwilioNumber(num.phoneNumber)}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400">
                        Comprar (~$1/mês)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ownedNumbers.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-3">Números Comprados no Twilio ({ownedNumbers.length})</h3>
                <div className="space-y-2">
                  {ownedNumbers.map((num, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded bg-purple-50">
                      <div>
                        <span className="font-bold">{num.phoneNumber}</span>
                        <span className="text-gray-600 ml-4">{num.friendlyName}</span>
                        <span className="text-xs ml-4 text-purple-600">SID: {num.sid}</span>
                      </div>
                      <span className="text-green-600 font-bold">Ativo</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Adicionar Manual */}
      {activeTab === 'manual' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Adicionar Número Manualmente</h2>
          <form onSubmit={addNumber} className="space-y-4">
            <input 
              placeholder="Número (ex: +5511999999999)" 
              className="w-full p-2 border rounded"
              value={form.number} 
              onChange={(e) => setForm({...form, number: e.target.value})} 
              required />
            <input 
              placeholder="País" 
              className="w-full p-2 border rounded"
              value={form.country} 
              onChange={(e) => setForm({...form, country: e.target.value})} 
              required />
            <input 
              placeholder="Código do País (ex: 55)" 
              className="w-full p-2 border rounded"
              value={form.countryCode} 
              onChange={(e) => setForm({...form, countryCode: e.target.value})} 
              required />
            <input 
              type="number" 
              step="0.01"
              placeholder="Preço (R$)" 
              className="w-full p-2 border rounded"
              value={form.price} 
              onChange={(e) => setForm({...form, price: e.target.value})} 
              required />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Adicionar Número
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
