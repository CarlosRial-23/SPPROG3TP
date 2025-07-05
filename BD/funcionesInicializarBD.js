export async function dropearTabla(db,nombreTabla) {
  try {
    const query = `DROP TABLE IF EXISTS ${nombreTabla}`;
    const resultado = await db.execute(query);
    console.log(`Tabla ${nombreTabla} vacia`);
  } catch (error) {
    console.log("Error al eliminar los datos de la tabla", error.message);
  }
}

export async function crearTabla(db, nombreTabla) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS ${nombreTabla} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  url_imagen VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL CHECK(cantidad >=1),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);
`;
    const resultado = await db.execute(query);
    console.log(`Tabla ${nombreTabla} creada`);
  } catch {
    console.log("No se pudo crear la tabla.");
  }
}

export async function crearTablaVenta(db,nombreTabla) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS ${nombreTabla} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(100) NOT NULL,
  fecha DATETIME NOT NULL,
  precio_total DECIMAL(10,2) NOT NULL
);
`;
    const resultado = await db.execute(query);
    console.log(`Tabla ${nombreTabla} creada`);
  } catch {
    console.log("No se pudo crear la tabla.");
  }
}

export async function cargarTabla(db,nombreTabla,arrayDatos) {
    try {
    const query = `INSERT into ${nombreTabla} (nombre,url_imagen,precio,cantidad) values ?`; //Tendria que poner que es AUTOINCREMENT a la hora de crear la BD.
    const resultado = await db.query(query, [arrayDatos]);
    console.log(`Tabla ${nombreTabla} cargada`);
  } catch {
    console.log("No se cargaron los datos");
  }
}

export async function crearTablaVentasProductos(db,nombreTabla) {
    try {
    const query = `CREATE TABLE ventas_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_computadora INT,
    id_monitor INT,
    cantidad INT NOT NULL,
    tipo_producto ENUM('computadora', 'monitor') NOT NULL,
    
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_computadora) REFERENCES computadoras(id),
    FOREIGN KEY (id_monitor) REFERENCES monitores(id)
);`; //Tendria que poner que es AUTOINCREMENT a la hora de crear la BD.
    const resultado = await db.query(query);
    console.log(`Tabla ${nombreTabla} creada`);
  } catch (error){
    console.log("No se creo la tabla ventas_productos", error);
  }
}

