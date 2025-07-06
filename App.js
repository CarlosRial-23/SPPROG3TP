const express = require('express') 
const app = express()
const port = 3000
//requiero el sequelize
const { sequelize } = require("./Modelo/dbSequelize.js");

//Importacion Routers
const routerComputadora = require("./Rutas/computadoras.routes.js")
const routerMonitor = require("./Rutas/monitores.routes.js");
const routerTicket = require("./Rutas/ticket.routes.js")
const routerVentas = require("./Rutas/ventas.routes.js");

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


sequelize
.sync() //Se sincronice la BD
.then(() => {
  //Que se ejecute mi servidor
  app.listen(port, () => {
    `Example app listenning on port ${port}`;
  })})
.catch((err)=>{
    console.log("Unable to connect to the database", err);
})

