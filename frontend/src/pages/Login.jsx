import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { authAPI } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';

function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(formData);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Connexion réussie!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F6B3F] to-[#154d2f] flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-[#1F6B3F] mb-8">Se connecter</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Se souvenir de moi
            </label>
            <Link to="#" className="text-[#1F6B3F] hover:underline">
              Mot de passe oublié?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full font-semibold disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Pas encore de compte?{' '}
          <Link to="/register" className="text-[#1F6B3F] font-semibold hover:underline">
            S\'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
