const {sequelize} = require ("./dbSequelize");
const {DataTypes} = require ("sequelize");

const venta = sequelize.define("ventas", 
{ 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_usuario:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: false,
    },    
    precio_total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
},
{timestamps: false,
freezeTableName: true //Evitar que me cambie el nombre
}  
)

module.exports = venta;