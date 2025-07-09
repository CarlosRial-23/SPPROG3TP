const express = require('express') 
const app = express()

//Importacion Routers
const routerComputadora = require("./Rutas/computadoras.routes.js")
const routerMonitor = require("./Rutas/monitores.routes.js");
const routerTicket = require("./Rutas/ticket.routes.js")
const routerVentas = require("./Rutas/ventas.routes.js");
const routerAdmin = require("./Rutas/admin.routes.js")

app.use(express.static('Estatico'));
app.use('/', express.static('Estatico/pagesUser'));
app.use('/admin', express.static('Estatico/pagesAdmin'));

//Middleware para Json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routers
app.use('/', routerComputadora);
app.use('/', routerMonitor);
app.use('/', routerTicket);
app.use('/', routerVentas);
app.use('/admin', routerAdmin);

module.exports = app;