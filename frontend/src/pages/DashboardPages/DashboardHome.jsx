import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

function DashboardHome() {
  const stats = [
    { label: 'Terrains publiés', value: 0 },
    { label: 'Offres reçues', value: 0 },
    { label: 'Messages', value: 0 },
    { label: 'Favoris', value: 0 }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mon Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-[#1F6B3F]">{stat.value}</p>
              </div>
              <FiBarChart2 className="text-4xl text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <p className="text-gray-600">Aucune activité récente</p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Conseils</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Complétez votre profil pour augmenter votre crédibilité</li>
            <li>✓ Ajoutez des photos de qualité à vos annonces</li>
            <li>✓ Répondez rapidement aux offres</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
