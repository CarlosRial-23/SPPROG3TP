const express = require('express') 
const app = express()
const port = 3000

//requiero el sequelize
const { sequelize } = require("./Modelo/dbSequelize.js");

//requiero los modelos
const {tickets, getTicket, descargarTicket} = require("./Estatico/js/ticket.js")
const { computadora, monitor, venta, ventasProductos } = require("./Modelo/relaciones.js");


app.use(express.static('Estatico'));
app.use('/', express.static('Estatico/pagesUser'));
app.use('/admin', express.static('Estatico/pagesAdmin'));

//Middleware para Json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Ruta para obtener las computadoras. (clientes)
app.get("/computadoras/:id", async (req, res) => {
  try {
    const computadoras = await computadora.findOne({where: {id: req.params.id, activo: true}});
    res.status(200).json(computadoras);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

//Ruta para obtener los monitores. (clientes)
app.get("/monitores/:id", async (req, res) => {
  try {
    const monitores = await monitor.findOne({where: {id: req.params.id, activo: true}});
    res.status(200).json(monitores);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});



//Ruta para obtener las computadoras. (admin)
app.get("/admin/computadoras", async (req, res) => {
  try {
    const computadoras = await computadora.findAll();
    res.status(200).json(computadoras);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

//Ruta para obtener los monitores. (admin)
app.get("/admin/monitores", async (req, res) => {
  try {
    const monitores = await monitor.findAll();
    res.status(200).json(monitores);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});


//Ruta para obtener las ventas_productos
app.get("/admin/ventas-productos", async (req,res)=>{
  try {
    const registros = await ventasProductos.findAll({
       include: [
        { model: computadora, attributes: ['id', 'nombre', 'url_imagen', 'precio'], required: false },
        { model: monitor, attributes: ['id', 'nombre', 'url_imagen', 'precio'], required: false },
        { model: venta, attributes: ['id', 'fecha', 'precio_total'] }
      ]
    });
    res.status(200).json(registros);
  } catch(e){
    res.status(500).json({e: "Error en la consulta"})
  }
})



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

