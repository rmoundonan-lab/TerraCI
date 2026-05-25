const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
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
  landId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'land_id',
    references: {
      model: 'lands',
      key: 'id'
    }
  }
}, {
  tableName: 'favorites',
  timestamps: true,
  createdAt: 'added_at',
  updatedAt: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['land_id'] },
    { fields: ['user_id', 'land_id'], unique: true }
  ]
});

module.exports = Favorite;
