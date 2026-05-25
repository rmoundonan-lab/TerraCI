const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  participant1Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'participant_1_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  participant2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'participant_2_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  landId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'land_id',
    references: {
      model: 'lands',
      key: 'id'
    }
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    field: 'last_message_at'
  },
  lastMessage: {
    type: DataTypes.TEXT,
    field: 'last_message'
  }
}, {
  tableName: 'conversations',
  timestamps: true,
  indexes: [
    { fields: ['participant_1_id'] },
    { fields: ['participant_2_id'] },
    { fields: ['land_id'] }
  ]
});

module.exports = Conversation;
