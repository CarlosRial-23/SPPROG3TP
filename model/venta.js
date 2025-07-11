const { DataTypes } = require("sequelize");
const sequelize  = require('../database/index.js');

const Venta = sequelize.define('Venta', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY, 
    defaultValue: DataTypes.NOW, 
    allowNull: false,
    
    get() {
      // Convert to JavaScript Date object
      const rawValue = this.getDataValue('fecha');
      return rawValue instanceof Date ? rawValue : new Date(rawValue);
    }
   
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
