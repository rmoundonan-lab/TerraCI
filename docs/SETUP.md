# Guide d'Installation - TerraCI 🏠

## Prérequis

### Système
- Windows, macOS ou Linux
- RAM: 4GB minimum
- Disque: 2GB d'espace libre

### Logiciels
- Node.js 16+ ([Télécharger](https://nodejs.org/))
- PostgreSQL 12+ ([Télécharger](https://www.postgresql.org/))
- Git ([Télécharger](https://git-scm.com/))

## Installation Détaillée

### 1. Cloner le Projet

```bash
git clone https://github.com/rmoundonan-lab/terraci.git
cd terraci
```

### 2. Configuration PostgreSQL

#### Windows (PowerShell)
```powershell
# Démarrer le service PostgreSQL
Net start postgresql-x64-15

# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE terraci_db;
CREATE USER terraci_user WITH PASSWORD 'your_secure_password';
ALTER ROLE terraci_user SET client_encoding TO 'utf8';
ALTER ROLE terraci_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE terraci_user SET default_transaction_deferrable TO on;
ALTER ROLE terraci_user SET default_transaction_read_committed TO on;
GRANT ALL PRIVILEGES ON DATABASE terraci_db TO terraci_user;
\q
```

#### macOS/Linux
```bash
# Démarrer PostgreSQL
sudo systemctl start postgresql

# Se connecter
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE terraci_db;
CREATE USER terraci_user WITH PASSWORD 'your_secure_password';
ALTER ROLE terraci_user SET client_encoding TO 'utf8';
GRANT ALL PRIVILEGES ON DATABASE terraci_db TO terraci_user;
\q
```

### 3. Installation Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

#### Configuration .env (backend)

Éditer `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=terraci_db
DB_USER=terraci_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
BCRYPT_ROUNDS=10

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@terraci.ci

# Frontend
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

#### Lancer les migrations

```bash
# Créer les tables
npm run migrate

# Ajouter les données de test (optionnel)
npm run seed
```

#### Démarrer le backend

```bash
npm run dev
# Serveur sur http://localhost:5000
```

### 4. Installation Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local
```

#### Configuration .env.local (frontend)

Éditer `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### Démarrer le frontend

```bash
npm run dev
# Accédez à http://localhost:5173
```

## ✅ Vérification Installation

### Tester le Backend

```bash
curl http://localhost:5000/api/health
```

Doit retourner:
```json
{"success":true,"message":"Server is running"}
```

### Tester le Frontend

Visitez http://localhost:5173 dans votre navigateur.

## 🧪 Comptes de Test

### Acheteur
- Email: `buyer@test.com`
- Mot de passe: `password123`

### Vendeur
- Email: `seller@test.com`
- Mot de passe: `password123`

### Admin
- Email: `admin@test.com`
- Mot de passe: `password123`

## 🐛 Troubleshooting

### Erreur de connexion PostgreSQL

```
// Solution:
1. Vérifier que PostgreSQL est démarré
2. Vérifier les identifiants dans .env
3. Vérifier que la base de données existe
```

### Port 5000 déjà utilisé

```bash
# Trouver le processus
lsof -i :5000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans .env
PORT=5001
```

### Modules npm manquants

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 📝 Scripts Disponibles

### Backend

```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm start            # Lancer la production
npm test             # Lancer les tests
npm run migrate      # Exécuter les migrations
npm run seed         # Ajouter les données de test
```

### Frontend

```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm run preview      # Preview du build
npm run lint         # Linter le code
npm run format       # Formater le code
```

## 🚀 Déploiement Production

### Heroku Backend

```bash
cd backend
heroku create terraci-api
heroku config:set JWT_SECRET=your_secret
heroku config:set DATABASE_URL=your_postgres_url
git push heroku main
```

### Vercel Frontend

```bash
cd frontend
npm install -g vercel
vercel
```

## 📚 Ressources Utiles

- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Sequelize ORM](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🆘 Support

Pour les problèmes:
1. Vérifier les logs: `npm run dev` affiche les erreurs
2. Consulter la documentation API: [docs/API.md](./API.md)
3. Ouvrir une issue GitHub
4. Contacter: contact@terraci.ci

---

**Dernière mise à jour**: Mai 2024
