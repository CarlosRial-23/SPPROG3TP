import { crearTablaVentasProductos, dropearTabla, crearTabla, cargarTabla,crearTablaVenta, crearTablaUsuarios } from "./funcionesInicializarBD.js";
import mysql from 'mysql2/promise'; //Hago import y no require porque ya venia usando import en este modulo. //npm imysql2
import dotenv from 'dotenv'; //me traigo los .env  - /*npm i dotenv
dotenv.config();

const monitores = "monitores";
const computadoras = "computadoras";
const ventas = "ventas";
const ventas_productos = "ventas_productos";

const datosComputadoras = [
    ['PC oficina basico', '/images/pc_oficina.jpg', 1200, 10], //Ojo las comillas aca.
    ['PC gamer L4000', '/images/pc_gamerBasica.jpg', 2400, 10],
    ['PC Ultra R8500', '/images/pc_oficina.jpg', 3800, 10],
];
const datosMonitores = [
    ['Asus L4511 21"', '/images/monitor1.png', 11000, 10],
    ['MSI Z200 25"', '/images/monitor2.png', 22000, 10],
    ['LG Ultra Gear 27"', '/images/monitor3.png', 38000, 10],
];

export async function inicializarBD() {

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  //limpio las tablas
  dropearTabla(db,ventas_productos);
  dropearTabla(db,monitores);
  dropearTabla(db,computadoras);
  dropearTabla(db,ventas)

  //Creo las tablas 
  crearTabla(db,monitores);
  crearTabla(db,computadoras);
  crearTablaVenta(db,ventas);
  crearTablaVentasProductos(db,ventas_productos)
  crearTablaUsuarios(db);

  //Cargar tablas
  cargarTabla(db,monitores, datosMonitores);
  cargarTabla(db,computadoras, datosComputadoras);
  
  
  //Cargo 2 veces para probar el tema de la paginacion.
  cargarTabla(db,monitores, datosMonitores);
  cargarTabla(db,computadoras, datosComputadoras);

  await db.end();
}

inicializarBD();
