import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { authAPI } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';

function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'buyer'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Inscription réussie!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F6B3F] to-[#154d2f] flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-[#1F6B3F] mb-8">Créer un compte</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prénom</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <FiUser className="ml-3 text-gray-500" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field border-0"
                placeholder="Jean"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <FiUser className="ml-3 text-gray-500" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field border-0"
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <FiMail className="ml-3 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field border-0"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <FiLock className="ml-3 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field border-0"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type de compte</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="buyer">Acheteur</option>
              <option value="seller">Vendeur</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full font-semibold disabled:opacity-50"
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Vous avez déjà un compte?{' '}
          <Link to="/login" className="text-[#1F6B3F] font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
