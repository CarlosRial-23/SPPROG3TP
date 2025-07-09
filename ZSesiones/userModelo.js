const {sequelize} = require ("../Modelo/dbSequelize");
const {DataTypes} = require ("sequelize");

const usuario = sequelize.define("usuarios", 
{ 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email:{
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
    }
},
{timestamps: false,
freezeTableName: true //Evitar que me cambie el nombre
}  
)

module.exports = usuario;