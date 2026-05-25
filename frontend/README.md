# Frontend - TerraCI 🏡

## Installation

```bash
cd frontend
npm install
cp .env.example .env.local
```

## Configuration

Éditez `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Démarrage

```bash
npm run dev
# Accédez à http://localhost:5173
```

## Build Production

```bash
npm run build
npm run preview
```

## Structure

```
frontend/
├── src/
│   ├── api/          # Appels API
│   ├── components/   # Composants réutilisables
│   ├── pages/        # Pages de l'application
│   ├── store/        # État global (Zustand)
│   ├── App.jsx       # Composant racine
│   └── main.jsx      # Point d'entrée
├── index.html        # HTML principal
├── package.json      # Dépendances
└── vite.config.js    # Configuration Vite
```
