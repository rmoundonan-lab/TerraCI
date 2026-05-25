const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'reporter_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reportedUserId: {
    type: DataTypes.INTEGER,
    field: 'reported_user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reportedLandId: {
    type: DataTypes.INTEGER,
    field: 'reported_land_id',
    references: {
      model: 'lands',
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    field: 'admin_notes'
  },
  resolvedAt: {
    type: DataTypes.DATE,
    field: 'resolved_at'
  }
}, {
  tableName: 'reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['reporter_id'] },
    { fields: ['status'] }
  ]
});

module.exports = Report;
