const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offer = sequelize.define('Offer', {
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
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'buyer_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'seller_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  offeredPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'offered_price'
  },
  offeredPriceCurrency: {
    type: DataTypes.STRING(3),
    defaultValue: 'XOF',
    field: 'offered_price_currency'
  },
  message: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'withdrawn'),
    defaultValue: 'pending'
  },
  respondedAt: {
    type: DataTypes.DATE,
    field: 'responded_at'
  },
  respondedMessage: {
    type: DataTypes.TEXT,
    field: 'responded_message'
  }
}, {
  tableName: 'offers',
  timestamps: true,
  indexes: [
    { fields: ['land_id'] },
    { fields: ['buyer_id'] },
    { fields: ['seller_id'] },
    { fields: ['status'] }
  ]
});

module.exports = Offer;
