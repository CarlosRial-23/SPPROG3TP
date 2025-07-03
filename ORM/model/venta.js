const { sequelize } = require("../database/index.js");
const { DataTypes } = require("sequelize");

const Venta = sequelize.define('Venta', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha:{
    type: DataTypes.DATE,
    allowNull: false
  },
  total: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false,
  get() {
    return parseFloat(this.getDataValue('total'));
  }
}
  
}, {
  tableName: 'ventas',
  timestamps: false
});

module.exports = { Venta };