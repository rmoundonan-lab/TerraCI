const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LandImage = sequelize.define('LandImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  landId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'land_id',
    references: {
      model: 'lands',
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'image_url'
  },
  thumbnailUrl: {
    type: DataTypes.TEXT,
    field: 'thumbnail_url'
  },
  altText: {
    type: DataTypes.STRING,
    field: 'alt_text'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'display_order'
  }
}, {
  tableName: 'land_images',
  timestamps: true,
  createdAt: 'uploaded_at',
  updatedAt: false,
  indexes: [
    { fields: ['land_id'] }
  ]
});

module.exports = LandImage;
