const { cargarTablaProductos } = require('./funcionesInicializarBD.js');
const { Producto, Venta, DetalleVenta } = require('../model/modelos.js');
const { sequelize } = require('../database/index.js');
const { establecerRelaciones } = require('../model/relaciones.js'); 

async function inicializarBD() {
  try {
    await sequelize.authenticate();
    console.log('Conexión con Sequelize establecida correctamente.');

    // Primero eliminar las tablas que tienen dependencias
    await DetalleVenta.drop({ cascade: true });
    await Venta.drop({ cascade: true });
    await Producto.drop({ cascade: true });

    // Luego crear las tablas en orden inverso
    await Producto.sync({ force: true });
    await Venta.sync({ force: true });
    await DetalleVenta.sync({ force: true });

    // Cargar datos iniciales
    await cargarTablaProductos();
    
    console.log('Base de datos inicializada correctamente');
  } catch(error) {
    console.error("Error en inicialización:", error);
    throw error;
  }
}

module.exports = {inicializarBD}; // Cambia esta línea