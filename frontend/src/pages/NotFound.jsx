import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-[#1F6B3F] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-8">Désolé, la page que vous recherchez n'existe pas.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <FiHome /> Accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <FiArrowLeft /> Retour
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
