const ejs = require("ejs");
const path = require("path");
const express = require("express");
const app = express();
const puppeteer = require("puppeteer"); //npm install puppeteer
const {getCarrito} = require("./carrito.js")

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

    let detalleProducto = [];
    let total = 0;
    const newTicket = new Ticket();
    newTicket.id = Date.now();
    newTicket.fecha = new Date().toLocaleString();
    newTicket.nombreCliente = nombreUsuario

    const productos = JSON.parse(carrito);
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

    let html = await ejs.renderFile(path.join(__dirname,"./", "pagesUser", "ticket.ejs"), {ticket : newTicket});
    res.status(200).send(html);
}

async function downloadTicketPdf(req,res) {
    //Aca necesitaria sacar le ticket de algun lado.     

    const browser = await puppeteer.launch({
        headless: true,
    })

    const page = await browser.newPage()
    await page.setContent(html);
    
    const pdfBuffer = await page.pdf({ 
    format: "A4", 
    printBackground: true, 
    margin: {
        top: "20px",
        right: "20px",
        left: "20px",
        bottom: "20px"
        },
    })

    await browser.close();

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${newTicket.id}.pdf` 
    });

    res.status(200).send(pdfBuffer);
}


app.get("/ticket/generar", getTicket);
app.post("/ticket/generar", getTicket);
//Indexo a ruta
app.get("/ticket/", getTicket);

