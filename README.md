# TerraCI - Plateforme Immobilière Sécurisée en Côte d'Ivoire 🏘️

Une plateforme fullstack moderne pour l'achat et la vente sécurisée de terrains en Côte d'Ivoire.

## 🎯 Objectif

TerraCI est une solution immobilière professionnelle permettant :
- Aux vendeurs de publier des terrains avec images et documents
- Aux acheteurs de rechercher et contacter des vendeurs
- L'affichage interactif sur carte GPS
- La sécurisation des échanges et des offres
- Un système de messagerie temps réel

## 🚀 Stack Technique

### Frontend
- **React 18** avec **Vite**
- **Tailwind CSS** pour le styling
- **React Router v6** pour la navigation
- **Axios** pour les appels API
- **Framer Motion** pour les animations
- **React Icons** pour les icônes
- **Leaflet** pour les cartes interactives
- **TanStack Query** pour la gestion du state serveur

### Backend
- **Node.js** runtime
- **Express.js** framework
- **PostgreSQL** base de données
- **Sequelize** ORM
- **JWT** pour l'authentification
- **Socket.IO** pour le chat temps réel
- **Multer** pour l'upload de fichiers
- **Helmet** pour la sécurité
- **bcryptjs** pour le hash des mots de passe

## 🎨 Design & Colors

Inspirée de Airbnb, Zillow, Jumia House et Booking.com

**Palette de couleurs:**
- Vert Foncé: `#1F6B3F` (primaire)
- Blanc: `#FFFFFF` (background)
- Gris Clair: `#F5F5F5` (surfaces)
- Gris Moyen: `#8B8B8B` (texte secondaire)
- Doré léger: `#D4AF37` (accents)

## 📁 Structure du Projet

```
terraci/
├── frontend/              # Application React
├── backend/               # Serveur Node.js
├── database/              # SQL Schema
└── docs/                  # Documentation
```

## 🛠️ Installation Rapide

### Backend
```bash
cd backend
npm install
cp .env.example .env.local
# Éditer .env.local
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Database Schema](./database/schema.sql)

## 🚀 Démarrage Rapide

1. Créez une base PostgreSQL: `terraci_db`
2. Configurez les variables d'environnement
3. Exécutez les migrations
4. Démarrez frontend et backend

---

**Construisons l'immobilier de demain ! 🏘️**