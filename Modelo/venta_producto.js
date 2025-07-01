const {sequelize} = require ("./dbSequelize");
const {DataTypes} = require ("sequelize");


//Pensar que hacer. 
const ventasProductos = sequelize.define("ventas_productos", 
{ 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "ventas",
            key: "id"
        }
    },
    id_computadora: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: "computadoras",
            key: "id"
        }
    },
    id_monitor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: "monitores",
            key: "id"
        }
    },

    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo_producto:{
        type: DataTypes.ENUM("computadora", "monitor"),
        allowNull: false
    }
},
{timestamps: false,
freezeTableName: true //Evitar que me cambie el nombre
}  
);

module.exports = ventasProductos;