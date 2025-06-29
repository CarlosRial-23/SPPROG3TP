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

async function downloadTicketPdf(req,res) {
    let detalleProducto = [];
    let total = 0;
    const newTicket = new Ticket();
    newTicket.id = Date.now();
    newTicket.fecha = new Date.toLocaleString();
    newTicket.nombreCliente = localStorage.getItem("nombreUsuario");

    const productos = JSON.parse(getCarrito());
    productos.forEach(element => {
        const precioUnitario = parseFloat(element.precio);
        const subtotal = precioUnitario * element.precio;
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
        "Content-Disposition": `attachment; filename=${req.params.id}.pdf` 
    });

    res.status(200).send(pdfBuffer);
}

//Indexo a ruta
app.get("/ticket/download", downloadTicketPdf);

const port = 3000;
app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`);
})
