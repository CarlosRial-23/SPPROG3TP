const { sequelize } = require("../database/index.js");
const { DataTypes } = require("sequelize");

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url_imagen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 100,
    },
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 15,
    },
    allowNull: false,
  },
}, {
  tableName: 'productos',
  timestamps: false
});

module.exports = { Producto };

