const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LandDocument = sequelize.define('LandDocument', {
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
  documentUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'document_url'
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'document_type'
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'file_name'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    field: 'file_size'
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'land_documents',
  timestamps: true,
  createdAt: 'uploaded_at',
  updatedAt: false,
  indexes: [
    { fields: ['land_id'] }
  ]
});

module.exports = LandDocument;
