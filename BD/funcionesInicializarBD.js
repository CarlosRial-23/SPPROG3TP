export async function dropearTabla(db,nombreTabla) {
  try {
    const query = `DROP TABLE IF EXISTS ${nombreTabla}`;
    const resultado = await db.execute(query);
    console.log(`Tabla ${nombreTabla} vacia`);
  } catch {
    console.log("Error al eliminar los datos de la tabla");
  }
}

export async function crearTabla(db, nombreTabla) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS ${nombreTabla} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  url_imagen VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL
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