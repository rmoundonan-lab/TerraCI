import React from 'react';
import { FiMapPin, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function MyLands() {
  // TODO: Fetch user lands from API
  const lands = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mes terrains</h1>
        <Link to="/dashboard/new-land" className="btn-primary flex items-center gap-2">
          <FiPlus /> Publier un terrain
        </Link>
      </div>

      {lands.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMapPin className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Vous n'avez pas encore publié de terrain</p>
          <Link to="/dashboard/new-land" className="btn-primary inline-block">
            Publier mon premier terrain
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => (
            <div key={land.id} className="card p-6">
              <h3 className="text-lg font-semibold mb-2">{land.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{land.address}</p>
              <div className="flex gap-2">
                <Link to={`/dashboard/lands/${land.id}`} className="btn-secondary text-sm flex items-center gap-1">
                  <FiEdit /> Éditer
                </Link>
                <button className="btn-danger text-sm flex items-center gap-1">
                  <FiTrash2 /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLands;
