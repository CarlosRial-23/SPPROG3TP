const express = require('express') 
const app = express()
const port = 3000

//requiero el sequelize
const { sequelize } = require("./Modelo/dbSequelize.js");

//requiero los modelos
const computadora = require("./Modelo/computadora.js");
const monitor = require("./Modelo/monitor.js");
const {tickets, getTicket, descargarTicket} = require("./Estatico/js/ticket.js")

app.use(express.static('Estatico'));
app.use('/', express.static('Estatico/pagesUser'));
app.use('/admin', express.static('Estatico/pagesAdmin'));

//Middleware para Json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Ruta para obtener las computadoras.
app.get("/computadoras", async (req, res) => {
  try {
    const computadoras = await computadora.findAll({where: {activo: true}});
    console.log(computadoras)
    res.status(200).json(computadoras);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

//Ruta para obtener los monitores. 
app.get("/monitores", async (req, res) => {
  try {
    const monitores = await monitor.findAll({where: {activo: true}});
    console.log(monitores)
    res.status(200).json(monitores);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

//Para ver el ticket
app.get("/ticket/generar", getTicket);

app.get("/ticket/download/:id", async (req, res) => {
  const ticketId = req.params.id;
  const ticket = tickets[ticketId];

  if (!ticket) {
    return res.status(404).send("Ticket no encontrado");
  }

  try {
    const pdfBuffer = await descargarTicket(ticket);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=ticket_${ticket.id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).send("Error generando PDF");
  }
});

//Sincronizo la BD.
sequelize
.sync()
.then(() => {
  app.listen(port, () => {
    `Example app listenning on port ${port}`;
  })})
.catch((err)=>{
    console.log("Unable to connect to the database", err);
})

