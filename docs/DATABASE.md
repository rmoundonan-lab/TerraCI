# Architecture Base de Données - TerraCI 🏠

## Schéma Relationnel

```sql
-- TABLE: users
users (PK: id)
├── id (INTEGER PRIMARY KEY)
├── email (VARCHAR UNIQUE)
├── passwordHash (TEXT)
├── firstName (VARCHAR)
├── lastName (VARCHAR)
├── phone (VARCHAR)
├── bio (TEXT)
├── avatarUrl (TEXT)
├── role (ENUM: admin, seller, buyer)
├── isActive (BOOLEAN)
├── isVerified (BOOLEAN)
├── emailVerifiedAt (TIMESTAMP)
├── lastLoginAt (TIMESTAMP)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

-- TABLE: lands
lands (PK: id, FK: userId)
├── id (INTEGER PRIMARY KEY)
├── userId (FK -> users.id)
├── title (VARCHAR)
├── description (TEXT)
├── price (DECIMAL)
├── surface (DECIMAL)
├── type (ENUM: residential, commercial, agricultural, mixed)
├── city (VARCHAR)
├── district (VARCHAR)
├── address (VARCHAR)
├── latitude (DECIMAL)
├── longitude (DECIMAL)
├── status (ENUM: available, sold, unavailable)
├── verified (ENUM: pending, verified, rejected)
├── viewsCount (INTEGER)
├── imagesCount (INTEGER)
├── isFeatured (BOOLEAN)
├── featuredUntil (TIMESTAMP)
├── deletedAt (TIMESTAMP)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

-- TABLE: land_images
land_images (PK: id, FK: landId)
├── id (INTEGER PRIMARY KEY)
├── landId (FK -> lands.id)
├── imageUrl (TEXT)
├── thumbnailUrl (TEXT)
├── altText (VARCHAR)
├── displayOrder (INTEGER)
├── uploadedAt (TIMESTAMP)
└── deletedAt (TIMESTAMP)

-- TABLE: land_documents
land_documents (PK: id, FK: landId)
├── id (INTEGER PRIMARY KEY)
├── landId (FK -> lands.id)
├── documentUrl (TEXT)
├── documentType (VARCHAR)
├── fileName (VARCHAR)
├── fileSize (INTEGER)
├── verified (BOOLEAN)
├── uploadedAt (TIMESTAMP)
└── deletedAt (TIMESTAMP)

-- TABLE: offers
offers (PK: id, FK: landId, buyerId, sellerId)
├── id (INTEGER PRIMARY KEY)
├── landId (FK -> lands.id)
├── buyerId (FK -> users.id)
├── sellerId (FK -> users.id)
├── offeredPrice (DECIMAL)
├── offeredPriceCurrency (VARCHAR)
├── message (TEXT)
├── status (ENUM: pending, accepted, rejected, withdrawn)
├── respondedAt (TIMESTAMP)
├── respondedMessage (TEXT)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

-- TABLE: conversations
conversations (PK: id, FK: participant1Id, participant2Id, landId)
├── id (INTEGER PRIMARY KEY)
├── participant1Id (FK -> users.id)
├── participant2Id (FK -> users.id)
├── landId (FK -> lands.id)
├── lastMessageAt (TIMESTAMP)
├── lastMessage (TEXT)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

-- TABLE: messages
messages (PK: id, FK: conversationId, senderId, recipientId)
├── id (INTEGER PRIMARY KEY)
├── conversationId (FK -> conversations.id)
├── senderId (FK -> users.id)
├── recipientId (FK -> users.id)
├── content (TEXT)
├── isRead (BOOLEAN)
├── readAt (TIMESTAMP)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

-- TABLE: favorites
favorites (PK: id, FK: userId, landId)
├── id (INTEGER PRIMARY KEY)
├── userId (FK -> users.id)
├── landId (FK -> lands.id)
├── addedAt (TIMESTAMP)
└── unique(userId, landId)

-- TABLE: reviews
reviews (PK: id, FK: reviewerId, reviewedUserId, landId)
├── id (INTEGER PRIMARY KEY)
├── reviewerId (FK -> users.id)
├── reviewedUserId (FK -> users.id)
├── landId (FK -> lands.id)
├── rating (INTEGER 1-5)
├── comment (TEXT)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

-- TABLE: notifications
notifications (PK: id, FK: userId)
├── id (INTEGER PRIMARY KEY)
├── userId (FK -> users.id)
├── type (VARCHAR)
├── title (VARCHAR)
├── message (TEXT)
├── relatedId (INTEGER)
├── relatedType (VARCHAR)
├── isRead (BOOLEAN)
├── readAt (TIMESTAMP)
├── createdAt (TIMESTAMP)
└── deletedAt (TIMESTAMP)

-- TABLE: reports
reports (PK: id, FK: reporterId, reportedUserId, reportedLandId)
├── id (INTEGER PRIMARY KEY)
├── reporterId (FK -> users.id)
├── reportedUserId (FK -> users.id)
├── reportedLandId (FK -> lands.id)
├── reason (VARCHAR)
├── description (TEXT)
├── status (ENUM: pending, resolved, dismissed)
├── adminNotes (TEXT)
├── resolvedAt (TIMESTAMP)
├── createdAt (TIMESTAMP)
└── deletedAt (TIMESTAMP)
```

## Relations

### One-to-Many (1:N)

| Parent | Enfant | Clé étrangère |
|--------|--------|---------------|
| users | lands | userId |
| users | favorites | userId |
| users | reviews (reviewer) | reviewerId |
| users | reviews (reviewed) | reviewedUserId |
| users | conversations | participant1Id, participant2Id |
| users | messages | senderId, recipientId |
| users | notifications | userId |
| users | reports | reporterId, reportedUserId |
| lands | land_images | landId |
| lands | land_documents | landId |
| lands | offers | landId |
| lands | favorites | landId |
| lands | reviews | landId |
| lands | reports | reportedLandId |
| conversations | messages | conversationId |

### Many-to-Many (M:N)

| Table 1 | Table 2 | Junction Table |
|---------|---------|----------------|
| users | lands | favorites |
| users | users | conversations |

## Indexes

### Indexes Primaires
```sql
PRIMARY KEY (id) -- sur toutes les tables
```

### Indexes Secondaires
```sql
-- Authentification
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Performance des recherches
CREATE INDEX idx_lands_city ON lands(city);
CREATE INDEX idx_lands_type ON lands(type);
CREATE INDEX idx_lands_status ON lands(status);
CREATE INDEX idx_lands_userId ON lands(userId);
CREATE INDEX idx_lands_isFeatured ON lands(isFeatured);

-- Messages et conversations
CREATE INDEX idx_conversations_participant1 ON conversations(participant1Id);
CREATE INDEX idx_conversations_participant2 ON conversations(participant2Id);
CREATE INDEX idx_messages_conversationId ON messages(conversationId);
CREATE INDEX idx_messages_senderId ON messages(senderId);
CREATE INDEX idx_messages_isRead ON messages(isRead);

-- Offres
CREATE INDEX idx_offers_landId ON offers(landId);
CREATE INDEX idx_offers_buyerId ON offers(buyerId);
CREATE INDEX idx_offers_sellerId ON offers(sellerId);
CREATE INDEX idx_offers_status ON offers(status);

-- Autres
CREATE INDEX idx_favorites_userId ON favorites(userId);
CREATE INDEX idx_favorites_landId ON favorites(landId);
CREATE INDEX idx_notifications_userId ON notifications(userId);
CREATE INDEX idx_notifications_isRead ON notifications(isRead);
CREATE INDEX idx_reports_status ON reports(status);
```

## Contraintes

### Unique Constraints
```sql
ALTER TABLE users ADD CONSTRAINT uq_email UNIQUE(email);
ALTER TABLE favorites ADD CONSTRAINT uq_user_land UNIQUE(userId, landId);
```

### Check Constraints
```sql
ALTER TABLE users ADD CONSTRAINT ck_role CHECK(role IN ('admin', 'seller', 'buyer'));
ALTER TABLE lands ADD CONSTRAINT ck_price CHECK(price > 0);
ALTER TABLE lands ADD CONSTRAINT ck_surface CHECK(surface > 0);
ALTER TABLE reviews ADD CONSTRAINT ck_rating CHECK(rating >= 1 AND rating <= 5);
```

### Foreign Key Constraints
```sql
ALTER TABLE lands ADD CONSTRAINT fk_lands_userId FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE offers ADD CONSTRAINT fk_offers_buyerId FOREIGN KEY(buyerId) REFERENCES users(id);
ALTER TABLE offers ADD CONSTRAINT fk_offers_sellerId FOREIGN KEY(sellerId) REFERENCES users(id);
-- ... etc
```

## Données de Test

### Compte Admin
```sql
INSERT INTO users (email, passwordHash, firstName, lastName, role, isVerified, isActive)
VALUES (
  'admin@terraci.ci',
  '$2b$10$...',
  'Admin',
  'TerraCI',
  'admin',
  true,
  true
);
```

## Statistiques Base de Données

### Taille estimée
- **Petite instance**: < 100K terrains - ~500MB
- **Moyenne instance**: 100K-1M terrains - ~5GB
- **Grande instance**: > 1M terrains - > 20GB

### Requêtes fréquentes

```sql
-- Terrains par ville
SELECT city, COUNT(*) FROM lands WHERE status='available' GROUP BY city;

-- Top vendeurs
SELECT u.*, COUNT(l.id) as landCount FROM users u
LEFT JOIN lands l ON u.id = l.userId
GROUP BY u.id ORDER BY landCount DESC LIMIT 10;

-- Offres en attente
SELECT * FROM offers WHERE status='pending' ORDER BY createdAt DESC;

-- Utilisateurs actifs
SELECT COUNT(*) FROM users WHERE lastLoginAt > NOW() - INTERVAL 7 DAY;
```

## Backup et Maintenance

### Backup
```bash
pg_dump -U terraci_user terraci_db > backup.sql
```

### Restore
```bash
psql -U terraci_user terraci_db < backup.sql
```

### Vacuum (Optimisation)
```sql
VACUUM ANALYZE;
```

---

**Dernière mise à jour**: Mai 2024
