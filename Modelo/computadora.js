const {sequelize} = require ("../Modelo/dbSequelize");
const {DataTypes} = require ("sequelize");

const computadora = sequelize.define("computadoras", 
{ 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    url_imagen: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
{timestamps: false,
freezeTableName: true //Evitar que me cambie el nombre
}  
)

module.exports = computadora;