import { dropearTabla } from "./funcionesInicializarBD.js";
import { crearTabla } from "./funcionesInicializarBD.js";
import { cargarTabla } from "./funcionesInicializarBD.js";
import mysql from 'mysql2/promise'; //Hago import y no require porque ya venia usando import en este modulo. //npm imysql2
import dotenv from 'dotenv'; //me traigo los .env  - /*npm i dotenv
dotenv.config();

const monitores = "monitores";
const computadoras = "computadoras";
const datosComputadoras = [
    ['PC oficina basico', '/images/pc_oficina.jpg', 1200, 0], //Ojo las comillas aca.
    ['PC gamer L4000', '/images/pc_gamerBasica.jpg', 2400, 0],
    ['PC Ultra R8500', '/images/pc_oficina.jpg', 3800, 0],
];
const datosMonitores = [
    ['Asus L4511 21"', '/images/monitor1.png', 11000, 0],
    ['MSI Z200 25"', '/images/monitor2.png', 22000, 0],
    ['LG Ultra Gear 27"', '/images/monitor3.png', 38000, 0],
];

export async function inicializarBD() {

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  //limpio las tablas
  dropearTabla(db,monitores);
  dropearTabla(db,computadoras);

  //Creo las tablas 
  crearTabla(db,monitores);
  crearTabla(db,computadoras);

  //Cargar tablas
  cargarTabla(db,monitores, datosMonitores);
  cargarTabla(db,computadoras, datosComputadoras);

  await db.end();
}

inicializarBD();