const { sequelize } = require("../database/index.js");
const { DataTypes } = require("sequelize");
const { Producto } = require("./producto.js");
const { Venta } = require("./venta.js");

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
      validate: {
        min: 1
      }
    },

    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 1
      },
      get() {
        return parseFloat(this.getDataValue('precio_unitario'));
      }
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "detalles_venta",
    timestamps: true, // Unifica las opciones en un solo objeto
  }
);

DetalleVenta.belongsTo(Venta, {
    foreignKey: "venta_id",
    as: "venta"
});

DetalleVenta.belongsTo(Producto, {
    foreignKey: "producto_id",
    as: "producto"
});

module.exports = { DetalleVenta };
