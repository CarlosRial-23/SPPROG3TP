const { cargarTablaProductos} = require('./funcionesInicializarBD.js');
const { Producto, Venta, DetalleVenta, Usuario } = require('../model/modelos.js');
const sequelize = require('../database/index.js');
const { establecerRelaciones } = require('../model/relaciones.js');
const bcrypt = require('bcryptjs');

// Función para crear un usuario inicial
async function crearUsuarioInicial() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('1234admin', salt);
  
  await Usuario.findOrCreate({
    where: { email: 'carlos_rial@example.com' },
    defaults: {
      password: hashedPassword,
      rol: 'admin'
    }
  });
}

// Función para inicializar la base de datos
async function inicializarBD() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión con Sequelize establecida correctamente.');

    await sequelize.drop(); 
    
    // Sincronizar modelos
    await Producto.sync({ force: true });
    await Venta.sync({ force: true });
    await DetalleVenta.sync({ force: true });
    await Usuario.sync({ force: true });

    // Crear el usuario inicial
    await crearUsuarioInicial();
    // Cargar productos y usuarios iniciales
    await cargarTablaProductos();
    // Si tienes relaciones entre los modelos, también las debes establecer
    await establecerRelaciones();

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error("Error en inicialización:", error);
    throw error;
  }
}

module.exports = { inicializarBD };
