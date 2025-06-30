const ejs = require("ejs");
const path = require("path");
const express = require("express");
const app = express();
const puppeteer = require("puppeteer"); //npm install puppeteer

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const tickets = {}; // objeto donde voy a guardar mis tickets.

//Tengo el ticket
class Ticket {
  id = "";
  fecha = "";
  nombreEmpresa = "Tienda Tech";
  nombreCliente = "";
  detalleProducto = "";
  precioTotal = 0;
  view = true;
}

async function getTicket(req, res) {
  const { carrito, nombreUsuario } = req.query; //es GET

  if (!carrito) {
    return res.status(400).send("El carrito esta vacio");
  }

  const productos = JSON.parse(carrito);
  let detalleProducto = [];
  let total = 0;
  const newTicket = new Ticket();
  newTicket.id = Date.now();
  newTicket.fecha = new Date().toLocaleString();
  newTicket.nombreCliente = nombreUsuario;

  productos.forEach((element) => {
    const precioUnitario = parseFloat(element.precio);
    const subtotal = precioUnitario * element.cantidad;
    total += subtotal;

    detalleProducto.push({
      nombre: element.nombre,
      precio: element.precio,
      cantidad: element.cantidad,
      subtotal: subtotal,
    });
  });
  newTicket.total = total;
  newTicket.detalleProducto = detalleProducto;

  tickets[newTicket.id] = newTicket;

  const rutaEJS = path.join(__dirname, "..", "pagesUser", "ticket.ejs");
  console.log("Ruta EJS RESUELTA:", rutaEJS);
  let html = await ejs.renderFile(
    path.join(__dirname, "..", "pagesUser", "ticket.ejs"),
    { ticket: newTicket }
  );
  res.status(200).send(html);
}

async function descargarTicket(ticket) {
  //Renderizo el ticket a partir del HTML generado.
 const rutaTicket = path.join(__dirname, "..", "pagesUser", "ticketImpreso.ejs");
  const html = await ejs.renderFile(rutaTicket, { ticket });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" }); //Espera a que se cargue una vez cargado todo el conetnido y resueltas las solicitudes.

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "20px",
      left: "20px",
      bottom: "20px",
    },
    displayHeaderFooter: false,
  });
  await browser.close();
  return pdfBuffer;
}

//Una vez hecho esto se tiene que persistir en la BD para ver las ventas realizadas.
module.exports = {tickets, getTicket, descargarTicket};
