const { DataTypes } = require("sequelize");
const sequelize  = require('../database/index.js');


const Usuario = sequelize.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  
  rol: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
  },
  
},{
  tableName: "usuarios",
  freezeTableName: true,
  timestamps: false,
});

module.exports = { Usuario };