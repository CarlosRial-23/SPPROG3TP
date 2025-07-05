const dotenv = require('dotenv');
const { Producto } = require('../model/producto.js');
const { Venta } = require('../model/venta.js');
const { DetalleVenta } = require('../model/detalleVenta.js');
const { sequelize } = require('../database/index.js');

dotenv.config();

exports.dropearTables = async function() {
  try {
    await DetalleVenta.sync({ force: true }); 
    await Venta.sync({ force: true });
    await Producto.sync({ force: true });
    console.log("Tablas reseteadas correctamente");
  } catch (error) {
    console.log("Error al resetear tablas", error.message);
  }
}

/*
async function crearTablaProductos(db) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  url_imagen VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL,
  categoria ENUM('Monitor', 'Computadora') NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);`;
    const resultado = await db.execute(query);
    console.log(`Tabla productos creada`);
  } catch {
    console.log("No se pudo crear la tabla.");
  }
}
/*
exports.crearTablaVenta = async function (db) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS ventas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	usuario VARCHAR(100) NOT NULL,
	fecha DATE DEFAULT (CURRENT_DATE),
	total decimal
);`;
    const resultado = await db.execute(query);
    console.log(`Tabla ventas creada`);
  } catch {
    console.log("No se pudo crear la tabla.");
  }
}


exports.crearTablaDetallesVenta= async function(bd){
  try {
    const query = `CREATE TABLE IF NOT EXISTS detalles_venta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,  
  producto_id INT NOT NULL, 
  cantidad INT,
  precio_unitario DECIMAL(10, 2),
  subtotal DECIMAL(10, 2),
  FOREIGN KEY (venta_id) REFERENCES ventas(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);`;
    const resultado = await db.execute(query);
    console.log(`Tabla detalles_venta creada`);
  } catch {
    console.log("No se pudo crear la tabla.");
  }
}
*/

exports.cargarTablaProductos = async function(db) {
    try {
    const query = `INSERT INTO productos (nombre, url_imagen, precio, cantidad, categoria , activo) VALUES
  ("PC oficina basica", "/images/pc_oficina.jpg", 140000.99, 0, "Computadora", TRUE),
  ("PC gamer L4000", "/images/pc_gamerBasica.jpg", 240015.99, 0, "Computadora", TRUE),
  ("PC Ultra R8500", "/images/pc_gamerPro.jpg", 470100, 0, "Computadora", TRUE),
  ("ASUS L4511 21", "/images/monitor1.png", 140000.99, 0, "Monitor", TRUE),
  ("MSI Z200 25", "/images/monitor2.png", 199436.87, 0, "Monitor", TRUE),
  ("LG Ultra Gear 27", "/images/monitor3.png", 350470.99, 0, "Monitor", TRUE);
    `;
    await sequelize.query(query);
    console.log("Datos iniciales cargados en productos");
  } catch {
    console.log("No se cargaron los datos");
  }
}
