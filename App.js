const ejs = require("ejs"); //npm install ejs.
const fs = require('fs');
const path = require("path");
const puppeteer = require("puppeteer"); //npm install puppeteer
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true })); //const datos = req.body;
app.use(express.json()); //const datos = req.body;
app.use(express.static(path.join(__dirname, 'public')));

class Ticket {
    id = "";
    fecha = "";
    nombre = "";
    productos = [];
    total = 0;
    view = true;
}

async function getTicket(req, res) {
    const newTicket = new Ticket();
    newTicket.id = req.params.id;
    newTicket.fecha = new Date().toLocaleDateString();
    newTicket.nombre = "Charly Prueba"
    newTicket.productos = [{"nombre":"prod1","precio":100,"cantidad":1},{"nombre":"prod2","precio":200,"cantidad":2}];
    newTicket.total = newTicket.productos.reduce((sum, e) => sum + (e.precio * e.cantidad), 0);
    newTicket.view = true;

    let html = await ejs.renderFile(
        path.join(__dirname, "public", "vistas", "ticket.ejs"),
        { ticket: newTicket }
    );
    res.status(200).send(html);
}

async function downloadTicket(req, res) {
    const newTicket = new Ticket();
    newTicket.id = req.params.id;
    newTicket.fecha = new Date().toLocaleDateString();
    newTicket.nombre = "Charly Prueba"
    newTicket.productos = [{"nombre":"prod1","precio":100,"cantidad":1},{"nombre":"prod2","precio":200,"cantidad":2}];
    newTicket.total = newTicket.productos.reduce((sum, e) => sum + (e.precio * e.cantidad), 0);
    newTicket.view = false;
  
    const cssPath = path.join(__dirname, 'public', 'css', 'ticket.css');
    const css = fs.readFileSync(cssPath, 'utf8');
   

    let html = await ejs.renderFile(
      path.join(__dirname, "public", "vistas", "ticket.ejs"),
      { ticket: newTicket }
    );
  
    html = html.replace('</head>', `<style>${css}</style></head>`);

    const browser = await puppeteer.launch({
      headless: true,
    });
  
    const page = await browser.newPage();
  
    await page.setContent(html, {waitUntil: 'networkidle0' });
  
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "5px",
        right: "5px",
        bottom: "5px",
        left: "5px",
      },
      
    });
  
  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${req.params.id}.pdf`,
  });
  res.status(200).send(pdfBuffer);
}
app.use(express.static('public'));
app.use('/', express.static('public/pages'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/productos',express.static(path.join(__dirname, 'public', 'pages','productos.html')));
app.use('/carrito',express.static(path.join(__dirname, 'public','pages','carrito.html')));
app.get("/ticket/:id", getTicket);
app.get("/ticket/download/:id", downloadTicket);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
