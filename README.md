# TerraCI - Plateforme Immobilière Sécurisée 🏠

## 📋 Vue d'ensemble

TerraCI est une plateforme web moderne pour l'achat et la vente de terrains en Côte d'Ivoire. Elle offre une solution sécurisée et conviviale pour les acheteurs et vendeurs de propriétés.

### ✨ Caractéristiques principales

- **Authentification sécurisée** - JWT tokens avec refresh
- **Gestion des annonces** - Créer, modifier, supprimer des listings de terrains
- **Système d'offres** - Faire et gérer des offres d'achat
- **Messagerie en temps réel** - Chat avec Socket.IO
- **Favoris** - Marquer les terrains préférés
- **Avis et notation** - Système de notation des utilisateurs
- **Carte interactive** - Visualiser les terrains sur une carte
- **Tableau de bord admin** - Gestion de la plateforme
- **Notifications** - Alertes en temps réel

## 🛠 Stack Technique

### Backend
- **Node.js & Express.js** - Serveur API REST
- **PostgreSQL** - Base de données
- **Sequelize** - ORM
- **Socket.IO** - Communication en temps réel
- **JWT** - Authentification
- **Bcrypt** - Hachage des mots de passe
- **Multer** - Upload de fichiers
- **Nodemailer** - Envoi d'emails

### Frontend
- **React 18** - Framework UI
- **Vite** - Bundler
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Zustand** - État global
- **React Query** - Gestion des données
- **Socket.IO Client** - WebSockets
- **Framer Motion** - Animations

## 📁 Structure du Projet

```
terraci/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB, env)
│   │   ├── models/          # Modèles Sequelize
│   │   ├── controllers/     # Logique métier
│   │   ├── routes/          # Routes API
│   │   ├── middleware/      # Middleware (auth, validation)
│   │   ├── services/        # Services (email, socket, file)
│   │   └── server.js        # Point d'entrée
│   ├── database/
│   │   └── migrations/      # Migrations DB
│   ├── .env.example         # Variables d'environnement
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Appels API
│   │   ├── components/      # Composants React
│   │   ├── pages/           # Pages de l'application
│   │   ├── store/           # État global
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── API.md               # Documentation API
│   ├── DATABASE.md          # Schéma base de données
│   └── SETUP.md             # Guide d'installation
└── README.md
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

### Installation Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos configurations

# Créer la base de données
creatdb terraci_db

# Lancer le serveur
npm run dev
# Serveur sur http://localhost:5000
```

### Installation Frontend

```bash
cd frontend
npm install
cp .env.example .env.local

# Démarrer l'application
npm run dev
# Accédez à http://localhost:5173
```

## 📚 Documentation

- **[API Documentation](./docs/API.md)** - Endpoints et utilisation
- **[Database Schema](./docs/DATABASE.md)** - Structure de la base de données
- **[Setup Guide](./docs/SETUP.md)** - Guide d'installation détaillé

## 🔐 Authentification

### Flux d'authentification

1. **Registration** - POST `/api/auth/register`
2. **Login** - POST `/api/auth/login`
3. **Token refresh** - POST `/api/auth/refresh-token`
4. **Logout** - POST `/api/auth/logout`

### Headers requis

```
Authorization: Bearer <access_token>
```

## 🗄️ Base de Données

### Tables principales

- **users** - Utilisateurs (acheteurs, vendeurs, admins)
- **lands** - Annonces de terrains
- **land_images** - Images des terrains
- **land_documents** - Documents justificatifs
- **offers** - Offres d'achat
- **conversations** - Conversations entre utilisateurs
- **messages** - Messages
- **favorites** - Terrains favoris
- **reviews** - Avis sur les utilisateurs
- **notifications** - Notifications
- **reports** - Signalements

## 🔒 Sécurité

### Implémentées
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Input validation
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting (à implémenter)
- ✅ SQL injection prevention (Sequelize ORM)

## 📝 Endpoints API Principaux

### Authentification
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
```

### Utilisateurs
```
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/:id
GET    /api/users/search
```

### Terrains
```
GET    /api/lands
GET    /api/lands/:id
POST   /api/lands
PUT    /api/lands/:id
DELETE /api/lands/:id
GET    /api/lands/search
```

### Offres
```
POST   /api/offers
GET    /api/offers/user/sent
GET    /api/offers/user/received
PUT    /api/offers/:id
DELETE /api/offers/:id
```

### Messages
```
GET    /api/messages/conversations
GET    /api/messages/conversations/:id
POST   /api/messages
```

### Admin
```
GET    /api/admin/users
GET    /api/admin/lands
GET    /api/admin/reports
GET    /api/admin/stats
PUT    /api/admin/lands/:id/verify
PUT    /api/admin/reports/:id
```

## 🧪 Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Build Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Les fichiers sont dans dist/
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## 📧 Support

Pour les questions ou problèmes:
- Email: contact@terraci.ci
- GitHub Issues: https://github.com/rmoundonan-lab/terraci/issues

## 👨‍💻 Auteur

**Rasheed Moundonan**
- GitHub: [@rmoundonan-lab](https://github.com/rmoundonan-lab)
- Email: rmoundonan@gmail.com

---

**Dernière mise à jour**: Mai 2024
