const express = require("express");
const app = express();
const port = 3000;
//requiero el sequelize
const { sequelize } = require("./Modelo/dbSequelize.js");

//requiero los modelos
const computadora = require("./Modelo/computadora.js");
const monitor = require("./Modelo/monitor.js");

//Middleware para Json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Ruta para obtener las computadoras.
app.get("/computadoras", async (req, res) => {
  try {
    const computadoras = await computadora.findAll();
    res.status(200).json(computadoras);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

//Ruta para obtener los monitores. 
app.get("/monitores", async (req, res) => {
  try {
    const monitores = await monitor.findAll();
    res.status(200).json(monitores);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
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
