import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

function MyOffers() {
  // TODO: Fetch user offers from API
  const offers = [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mes offres</h1>

      {offers.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMessageSquare className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">Vous n'avez pas encore d'offres</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Offers list */}
        </div>
      )}
    </div>
  );
}

export default MyOffers;
