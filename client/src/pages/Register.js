import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrar</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="w-full p-3 border rounded mb-4"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" className="w-full p-3 border rounded mb-4"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            Registrar
          </button>
        </form>
        <p className="mt-4 text-center">
          Já tem conta? <Link to="/login" className="text-blue-600">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
