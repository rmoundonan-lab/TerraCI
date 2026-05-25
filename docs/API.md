# Documentation API - TerraCI 🏠

## Base URL

```
http://localhost:5000/api
```

## Authentification

Tous les endpoints protégés nécessitent un JWT token dans le header:

```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentification (/api/auth)

### Register

**POST** `/auth/register`

Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "buyer" // ou "seller"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "role": "buyer"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Login

**POST** `/auth/login`

Se connecter avec email et mot de passe.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Refresh Token

**POST** `/auth/refresh-token`

Obtenir un nouveau access token.

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

## 👤 Utilisateurs (/api/users)

### Get Profile

**GET** `/users/me` *(Protected)*

Obtenir le profil de l'utilisateur connecté.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "phone": "+225 01 23 45 67",
    "bio": "Je recherche les meilleurs terrains",
    "avatarUrl": "https://...",
    "role": "buyer",
    "isVerified": true,
    "createdAt": "2024-05-25T10:00:00Z"
  }
}
```

### Update Profile

**PUT** `/users/me` *(Protected)*

Mettre à jour le profil utilisateur.

**Body (form-data):**
```
firstName: "Jean"
lastName: "Dupont"
phone: "+225 01 23 45 67"
bio: "Bio de l'utilisateur"
avatar: <file>
```

### Get User Profile

**GET** `/users/:id`

Obtenir le profil public d'un utilisateur.

### Search Users

**GET** `/users/search?q=jean&role=seller`

Rechercher des utilisateurs.

---

## 🏠 Terrains (/api/lands)

### Get All Lands

**GET** `/lands?page=1&limit=12&status=available&type=residential&city=Abidjan&minPrice=1000000&maxPrice=50000000`

Obtenir la liste des terrains avec filtres.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 12)
- `status` - available, sold, unavailable
- `type` - residential, commercial, agricultural, mixed
- `city` - nom de la ville
- `minPrice` / `maxPrice` - plage de prix

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Terrain de 500m² à Abidjan",
      "description": "Description du terrain",
      "price": 25000000,
      "surface": 500,
      "type": "residential",
      "city": "Abidjan",
      "address": "Rue de la Paix, Cocody",
      "latitude": 5.3446,
      "longitude": -3.9708,
      "status": "available",
      "viewsCount": 150,
      "images": [
        { "id": 1, "imageUrl": "https://..." }
      ],
      "seller": {
        "id": 1,
        "firstName": "Jean",
        "lastName": "Dupont",
        "avatarUrl": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "pages": 5
  }
}
```

### Get Land Detail

**GET** `/lands/:id`

Obtenir les détails complets d'un terrain.

### Create Land

**POST** `/lands` *(Protected)*

Publier un nouveau terrain.

**Body (form-data):**
```
title: "Terrain de 500m²"
description: "Description détaillée"
price: 25000000
surface: 500
type: "residential"
city: "Abidjan"
district: "Cocody"
address: "Rue de la Paix"
latitude: 5.3446
longitude: -3.9708
images: <files>
```

### Update Land

**PUT** `/lands/:id` *(Protected)*

Mettre à jour un terrain.

### Delete Land

**DELETE** `/lands/:id` *(Protected)*

Supprimer un terrain.

---

## 💰 Offres (/api/offers)

### Create Offer

**POST** `/offers` *(Protected)*

Faire une offre d'achat.

**Body:**
```json
{
  "landId": 1,
  "offeredPrice": 20000000,
  "message": "Je suis intéressé par ce terrain"
}
```

### Get Sent Offers

**GET** `/offers/user/sent` *(Protected)*

Obtenir les offres que j'ai envoyées.

### Get Received Offers

**GET** `/offers/user/received` *(Protected)*

Obtenir les offres reçues.

### Update Offer Status

**PUT** `/offers/:id` *(Protected)*

Répondre à une offre.

**Body:**
```json
{
  "status": "accepted", // ou "rejected"
  "respondedMessage": "Message de réponse"
}
```

---

## 💬 Messages (/api/messages)

### Get Conversations

**GET** `/messages/conversations` *(Protected)*

Obtenir la liste des conversations.

### Get Conversation Messages

**GET** `/messages/conversations/:conversationId?page=1&limit=50` *(Protected)*

Obtenir les messages d'une conversation.

### Send Message

**POST** `/messages` *(Protected)*

**Body:**
```json
{
  "conversationId": 1,
  "content": "Bonjour, comment allez-vous?"
}
```

---

## ⭐ Favoris (/api/favorites)

### Add Favorite

**POST** `/favorites/:landId` *(Protected)*

Ajouter un terrain aux favoris.

### Remove Favorite

**DELETE** `/favorites/:landId` *(Protected)*

Retirer des favoris.

### Get Favorites

**GET** `/favorites?page=1&limit=12` *(Protected)*

Obtenir mes terrains favoris.

---

## 📋 Avis (/api/reviews)

### Create Review

**POST** `/reviews/:userId` *(Protected)*

Publier un avis sur un utilisateur.

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent, très satisfait de la transaction"
}
```

### Get User Reviews

**GET** `/reviews/user/:userId`

Obtenir les avis d'un utilisateur.

---

## 🔔 Notifications (/api/notifications)

### Get Notifications

**GET** `/notifications?page=1&limit=20` *(Protected)*

Obtenir les notifications.

### Mark as Read

**PUT** `/notifications/:id/read` *(Protected)*

Marquer une notification comme lue.

---

## 🛠️ Admin (/api/admin)

### Get Users

**GET** `/admin/users?page=1&limit=20&role=buyer&search=jean` *(Admin only)*

### Get Lands

**GET** `/admin/lands?page=1&limit=20&status=available&verified=pending` *(Admin only)*

### Verify Land

**PUT** `/admin/lands/:id/verify` *(Admin only)*

**Body:**
```json
{
  "verified": "verified" // ou "rejected", "pending"
}
```

### Get Reports

**GET** `/admin/reports?page=1&limit=20&status=pending` *(Admin only)*

### Get Statistics

**GET** `/admin/stats` *(Admin only)*

Obtenir les statistiques globales.

---

## ❌ Codes d'Erreur

| Code | Signification |
|------|---------------|
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Non trouvé |
| 409 | Conflit (ex: email déjà utilisé) |
| 500 | Erreur serveur |

**Format d'erreur:**
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    }
  ]
}
```

---

**Dernière mise à jour**: Mai 2024
