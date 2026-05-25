import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import MyLands from './MyLands';
import MyOffers from './MyOffers';

function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="lands" element={<MyLands />} />
        <Route path="offers" element={<MyOffers />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
