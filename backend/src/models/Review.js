const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'reviewer_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'reviewed_user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  landId: {
    type: DataTypes.INTEGER,
    field: 'land_id',
    references: {
      model: 'lands',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: DataTypes.TEXT
}, {
  tableName: 'reviews',
  timestamps: true,
  indexes: [
    { fields: ['reviewed_user_id'] },
    { fields: ['reviewer_id'] }
  ]
});

module.exports = Review;
