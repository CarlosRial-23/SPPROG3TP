const ejs = require("ejs");
const path = require("path");
const express = require("express");
const app = express();
const puppeteer = require("puppeteer"); //npm install puppeteer


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Tengo el ticket
class Ticket{
    id="";
    fecha="";
    nombreEmpresa="Tienda Tech";
    nombreCliente="";
    detalleProducto="";
    precioTotal=0;
    view = true;
}

async function getTicket(req,res) {
    const {carrito, nombreUsuario} = req.query; //es GET

    if(!carrito){
        return res.status(400).send("El carrito esta vacio");
    }

    const productos = JSON.parse(carrito);
    let detalleProducto = [];
    let total = 0;
    const newTicket = new Ticket();
    newTicket.id = Date.now();
    newTicket.fecha = new Date().toLocaleString();
    newTicket.nombreCliente = nombreUsuario

    productos.forEach(element => {
        const precioUnitario = parseFloat(element.precio);
        const subtotal = precioUnitario * element.cantidad;
        total += subtotal;

        detalleProducto.push({
        nombre: element.nombre,
        precio: element.precio,
        cantidad: element.cantidad,
        subtotal: subtotal,
        })
    })
    newTicket.total = total;
    newTicket.detalleProducto = detalleProducto;

    const rutaEJS = path.join(__dirname, "..", "pagesUser", "ticket.ejs");
    console.log("Ruta EJS RESUELTA:", rutaEJS)
    let html = await ejs.renderFile(path.join(__dirname,"..", "pagesUser", "ticket.ejs"), {ticket : newTicket});
    res.status(200).send(html);
}

module.exports = {getTicket};

