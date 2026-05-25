-- Create Database
CREATE DATABASE terraci_db;

-- Connect to database
\c terraci_db;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE land_type AS ENUM ('residential', 'commercial', 'agricultural', 'mixed');
CREATE TYPE land_status AS ENUM ('available', 'sold', 'pending', 'archived');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'buyer',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified_at TIMESTAMP,
  phone_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- User Verification Tokens
CREATE TABLE verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lands Table (Annonces terrains)
CREATE TABLE lands (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  price_currency VARCHAR(3) DEFAULT 'XOF',
  surface DECIMAL(10, 2) NOT NULL,
  surface_unit VARCHAR(20) DEFAULT 'sqm',
  type land_type NOT NULL,
  status land_status DEFAULT 'available',
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  verified verification_status DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP,
  views_count INTEGER DEFAULT 0,
  images_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_verified (verified),
  INDEX idx_city (city)
);

-- Land Images
CREATE TABLE land_images (
  id SERIAL PRIMARY KEY,
  land_id INTEGER NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_land_id (land_id)
);

-- Land Documents
CREATE TABLE land_documents (
  id SERIAL PRIMARY KEY,
  land_id INTEGER NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
  document_url TEXT NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  INDEX idx_land_id (land_id)
);

-- Favorites
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  land_id INTEGER NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, land_id),
  INDEX idx_user_id (user_id),
  INDEX idx_land_id (land_id)
);

-- Offers
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  land_id INTEGER NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
  buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offered_price DECIMAL(15, 2) NOT NULL,
  offered_price_currency VARCHAR(3) DEFAULT 'XOF',
  message TEXT,
  status offer_status DEFAULT 'pending',
  responded_at TIMESTAMP,
  responded_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_land_id (land_id),
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_seller_id (seller_id),
  INDEX idx_status (status)
);

-- Conversations (Chat)
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  participant_1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  land_id INTEGER REFERENCES lands(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP,
  last_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_participant_1 (participant_1_id),
  INDEX idx_participant_2 (participant_2_id),
  INDEX idx_land_id (land_id)
);

-- Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_is_read (is_read)
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id INTEGER,
  related_type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read)
);

-- Reports (Signalements fraude)
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reported_land_id INTEGER REFERENCES lands(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reporter_id (reporter_id),
  INDEX idx_status (status)
);

-- Reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  land_id INTEGER REFERENCES lands(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reviewed_user_id (reviewed_user_id),
  INDEX idx_reviewer_id (reviewer_id)
);

-- Admin Logs
CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id INTEGER,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at)
);

-- Create Indexes
CREATE INDEX idx_lands_lat_long ON lands(latitude, longitude);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversations_created ON conversations(created_at);

-- Create Views
CREATE VIEW user_statistics AS
SELECT
  u.id,
  u.email,
  COUNT(DISTINCT l.id) as lands_count,
  COUNT(DISTINCT f.id) as favorites_count,
  COUNT(DISTINCT o.id) as offers_count,
  COUNT(DISTINCT r.id) as reviews_count,
  AVG(r.rating) as average_rating
FROM users u
LEFT JOIN lands l ON u.id = l.user_id AND l.deleted_at IS NULL
LEFT JOIN favorites f ON u.id = f.user_id
LEFT JOIN offers o ON u.id = o.buyer_id
LEFT JOIN reviews r ON u.id = r.reviewed_user_id
GROUP BY u.id;

CREATE VIEW land_statistics AS
SELECT
  l.id,
  l.title,
  COUNT(DISTINCT f.id) as favorites_count,
  COUNT(DISTINCT o.id) as offers_count,
  COUNT(DISTINCT i.id) as images_count
FROM lands l
LEFT JOIN favorites f ON l.id = f.land_id
LEFT JOIN offers o ON l.id = o.land_id
LEFT JOIN land_images i ON l.id = i.land_id
WHERE l.deleted_at IS NULL
GROUP BY l.id;