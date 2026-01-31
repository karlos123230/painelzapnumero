import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [numbers, setNumbers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    loadNumbers();
    loadOrders();
  }, [selectedCountry]);

  const loadNumbers = async () => {
    const res = await axios.get(`http://localhost:5000/api/numbers/available?country=${selectedCountry}`);
    setNumbers(res.data);
  };

  const loadOrders = async () => {
    const res = await axios.get('http://localhost:5000/api/orders/my-orders');
    setOrders(res.data);
  };

  const rentNumber = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/numbers/rent/${id}`);
      loadNumbers();
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao alugar número');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Números Disponíveis</h1>
      
      <select className="mb-6 p-2 border rounded" onChange={(e) => setSelectedCountry(e.target.value)}>
        <option value="">Todos os países</option>
        <option value="Brasil">Brasil</option>
        <option value="USA">USA</option>
      </select>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {numbers.map(num => (
          <div key={num.id || num._id} className="bg-white p-6 rounded-lg shadow">
            <p className="font-bold">{num.country} (+{num.countryCode})</p>
            <p className="text-gray-600">{num.number}</p>
            <p className="text-green-600 font-bold">R$ {num.price}</p>
            <button onClick={() => rentNumber(num.id || num._id)} 
              className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Alugar
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id || order._id} className="bg-white p-4 rounded-lg shadow">
            <p>Número: {order.number || order.phoneNumber?.number}</p>
            <p>Status: {order.status}</p>
            {order.verificationCode && <p className="font-bold text-green-600 text-xl">Código: {order.verificationCode}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
