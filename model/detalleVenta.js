const { DataTypes } = require("sequelize");
const sequelize  = require('../database/index.js');

const DetalleVenta = sequelize.define("DetalleVenta",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 1 },
      get() {
        return parseFloat(this.getDataValue('precio_unitario'));
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    venta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ventas',
        key: 'id'
      }
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id'
      }
    }
  }, {
    tableName: "detalles_venta",
    timestamps: false,
  });


module.exports = { DetalleVenta };