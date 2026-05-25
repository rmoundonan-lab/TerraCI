import React from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiMapPin, FiTrendingUp, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      icon: <FiHome className="text-3xl" />,
      title: 'Annonces Vérifiées',
      description: 'Tous nos terrains sont vérifiés et sécurisés'
    },
    {
      icon: <FiMapPin className="text-3xl" />,
      title: 'Localisation Précise',
      description: 'Retrouvez les terrains sur une carte interactive'
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: 'Transactions Sécurisées',
      description: 'Vos transactions sont protégées et sécurisées'
    },
    {
      icon: <FiTrendingUp className="text-3xl" />,
      title: 'Meilleurs Prix',
      description: 'Comparez et trouvez les meilleures offres'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1F6B3F] to-[#154d2f] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            Bienvenue sur TerraCI 🏡
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            La plateforme immobilière n°1 en Côte d'Ivoire pour acheter et vendre des terrains en toute sécurité
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 justify-center"
          >
            <Link to="/search" className="btn-primary bg-white text-[#1F6B3F]">
              Rechercher des terrains
            </Link>
            <Link to="/register" className="btn-primary">
              S'inscrire maintenant
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#1F6B3F]">Pourquoi choisir TerraCI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="text-[#1F6B3F] mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1F6B3F] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer?</h2>
          <p className="text-lg mb-8">Rejoignez des milliers d'utilisateurs qui font confiance à TerraCI</p>
          <Link to="/register" className="btn-primary bg-white text-[#1F6B3F] text-lg px-8 py-3">
            Créer mon compte
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
