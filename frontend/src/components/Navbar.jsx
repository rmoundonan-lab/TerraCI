import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiSearch, FiMapPin, FiMessageSquare, FiUser, FiLogOut, FiMenu, FiX, FiBell } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#1F6B3F] flex items-center gap-2">
            <FiHome /> TerraCI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/search" className="flex items-center gap-2 text-gray-700 hover:text-[#1F6B3F] transition">
              <FiSearch /> Rechercher
            </Link>
            <Link to="/map" className="flex items-center gap-2 text-gray-700 hover:text-[#1F6B3F] transition">
              <FiMapPin /> Carte
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/chat" className="flex items-center gap-2 text-gray-700 hover:text-[#1F6B3F] transition">
                  <FiMessageSquare /> Messages
                </Link>
                <button className="relative text-gray-700 hover:text-[#1F6B3F] transition">
                  <FiBell size={20} />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                <Link to={`/profile/${user?.id}`} className="flex items-center gap-2 text-gray-700 hover:text-[#1F6B3F] transition">
                  <FiUser /> {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 btn-danger"
                >
                  <FiLogOut /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-[#1F6B3F] transition">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link to="/search" className="block py-2 text-gray-700 hover:text-[#1F6B3F]">
              Rechercher
            </Link>
            <Link to="/map" className="block py-2 text-gray-700 hover:text-[#1F6B3F]">
              Carte
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/chat" className="block py-2 text-gray-700 hover:text-[#1F6B3F]">
                  Messages
                </Link>
                <Link to={`/profile/${user?.id}`} className="block py-2 text-gray-700 hover:text-[#1F6B3F]">
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-red-500 hover:text-red-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-[#1F6B3F]">
                  Connexion
                </Link>
                <Link to="/register" className="block py-2 btn-primary">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
