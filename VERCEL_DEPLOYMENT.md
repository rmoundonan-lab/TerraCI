# Guide de Déploiement Vercel pour TerraCI

## 📋 Prérequis

- Compte Vercel (https://vercel.com)
- GitHub configuré avec accès à votre repository
- PostgreSQL externe (Vercel ne supporte pas PostgreSQL natif)
- Accès à vos variables d'environnement

## 🚀 Étapes de Déploiement

### 1. Préparation du Repository

```bash
# Assurez-vous que tout est committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Configuration Vercel

#### Option A: Via l'interface Web
1. Accédez à https://vercel.com/dashboard
2. Cliquez sur "Add New..." → "Project"
3. Importez votre repository GitHub `rmoundonan-lab/TerraCI`
4. Sélectionnez "Other" ou "Monorepo" comme framework
5. Configurez les variables d'environnement

#### Option B: Via Vercel CLI
```bash
# Installez Vercel CLI
npm i -g vercel

# Connectez-vous à Vercel
vercel login

# Déployez
vercel
```

### 3. Configuration des Variables d'Environnement

Dans le tableau de bord Vercel, ajoutez les variables suivantes:

**Backend Variables:**
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_secure_jwt_secret_key
JWT_REFRESH_SECRET=your_secure_refresh_secret
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-project.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@terraci.ci
MAX_FILE_SIZE=10485760
BCRYPT_ROUNDS=10
```

**Frontend Variables (optionnel):**
```
VITE_API_BASE_URL=https://your-project.vercel.app/api
VITE_SOCKET_URL=https://your-project.vercel.app
VITE_APP_NAME=TerraCI
```

### 4. Base de Données PostgreSQL

Vous avez plusieurs options:

#### Option A: Vercel PostgreSQL (Recommandé)
1. Dans Vercel Dashboard → "Storage"
2. Créez une nouvelle base PostgreSQL
3. Les credentials seront automatiquement disponibles

#### Option B: Service Externe
- **Supabase**: https://supabase.com (Gratuit avec PostgreSQL)
- **Railway**: https://railway.app
- **Render**: https://render.com
- **AWS RDS**: https://aws.amazon.com/rds/

### 5. Migrations de Base de Données

Après le déploiement, exécutez les migrations:

```bash
# Via la console Vercel (Deployments → Functions)
node backend/database/migrate.js

# Ou via SSH si disponible sur votre provider DB
```

### 6. Fichiers de Configuration

Le projet est maintenant configuré avec:

- ✅ `vercel.json` - Configuration de build et routes
- ✅ `.vercelignore` - Fichiers à ignorer
- ✅ `package.json` - Scripts de build root
- ✅ `backend/.env.example` - Exemple de variables backend
- ✅ `frontend/.env.example` - Exemple de variables frontend
- ✅ `vite.config.js` - Configuration optimisée Vite

## 🔧 Structuration des Routes

**Routes API:**
```
/api/* → backend/src/server.js
```

**Routes Frontend:**
```
/* → frontend/dist/index.html (SPA fallback)
```

## 📊 Limitations Vercel à Connaître

1. **Fonctions serverless**: Timeout de 60 secondes
2. **Upload de fichiers**: Taille maximale 50MB
3. **WebSockets**: Supportés via Socket.IO
4. **Base de données**: PostgreSQL externe obligatoire
5. **Emails**: Utilisez un service SMTP externe

## ⚙️ Optimisations Recommandées

### Backend
```javascript
// Ajoutez un health check pour Vercel
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() })
})

// Configurez les CORS pour production
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
```

### Frontend
```javascript
// Configurez l'URL API dynamiquement
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'
```

## 🔒 Sécurité

- ✅ Utilisez des secrets pour les variables sensibles
- ✅ Configurez HTTPS obligatoire
- ✅ Activez les domain protections
- ✅ Utilisez des tokens JWT courts (1h)
- ✅ Configurez les CORS correctement

## 📝 Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données PostgreSQL créée et accessible
- [ ] Migrations de base de données exécutées
- [ ] Frontend build sans erreurs
- [ ] Backend déprobe sans erreurs
- [ ] Tests passent en local
- [ ] Git repository pushé à jour
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Analytics et monitoring configurés

## 🐛 Dépannage

### Erreur: "Function exceeded maximum execution time"
- Augmentez le timeout des fonctions longues
- Divisez le travail en micro-services

### Erreur: "Cannot find module"
- Assurez-vous que les dépendances sont dans package.json
- Supprimez node_modules et réinstallez

### Erreur: "ENOENT: no such file or directory"
- Vérifiez les chemins de fichiers (case-sensitive)
- Utilisez des chemins relatifs corrects

### Database Connection Error
- Vérifiez le DATABASE_URL
- Assurez-vous que l'IP de Vercel est whitelistée
- Testez la connexion localement d'abord

## 📞 Support

- Docs Vercel: https://vercel.com/docs
- GitHub Issues: https://github.com/rmoundonan-lab/TerraCI/issues
- Discord: Rejoignez la communauté

## 🎉 Prochaines Étapes

Après un déploiement réussi:
1. Configurez un domaine personnalisé
2. Installez Sentry pour les error tracking
3. Configurez un CDN pour les assets
4. Mettez en place un système de monitoring
5. Configurez les webhooks GitHub
6. Testez tous les endpoints en production

---

**Dernière mise à jour:** Mai 2026
