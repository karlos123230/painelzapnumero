import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">SMS Panel</Link>
        
        {user && (
          <div className="flex items-center gap-6">
            <span className="text-sm">Saldo: R$ {user.balance?.toFixed(2)}</span>
            <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
            {user.isAdmin && (
              <Link to="/admin" className="hover:text-blue-200">Admin</Link>
            )}
            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
