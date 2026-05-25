import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
              <FiHome /> TerraCI
            </h3>
            <p className="text-gray-400">La plateforme immobilière de confiance en Côte d'Ivoire</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#D4AF37] transition">
                  Rechercher
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#D4AF37] transition">
                  Carte
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <FiMail /> contact@terraci.ci
              </li>
              <li className="flex items-center gap-2">
                <FiPhone /> +225 27 22 XX XX XX
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="#" className="hover:text-[#D4AF37] transition">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#D4AF37] transition">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TerraCI. Tous les droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
