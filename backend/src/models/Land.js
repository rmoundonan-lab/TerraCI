const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Land = sequelize.define('Land', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  priceCurrency: {
    type: DataTypes.STRING(3),
    defaultValue: 'XOF',
    field: 'price_currency'
  },
  surface: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  surfaceUnit: {
    type: DataTypes.STRING(20),
    defaultValue: 'sqm',
    field: 'surface_unit'
  },
  type: {
    type: DataTypes.ENUM('residential', 'commercial', 'agricultural', 'mixed'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'sold', 'pending', 'archived'),
    defaultValue: 'available'
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: DataTypes.STRING,
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: DataTypes.DECIMAL(10, 8),
  longitude: DataTypes.DECIMAL(11, 8),
  verified: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured'
  },
  featuredUntil: {
    type: DataTypes.DATE,
    field: 'featured_until'
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'views_count'
  },
  imagesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'images_count'
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  }
}, {
  tableName: 'lands',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['verified'] },
    { fields: ['city'] },
    { fields: ['latitude', 'longitude'] }
  ]
});

module.exports = Land;
