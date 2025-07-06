const express = require('express');
const routerComputadora = express.Router();
const computadora = require("../Modelo/computadora")

routerComputadora.get("/computadoras/:id", async (req, res) => {
  try {
    const computadoras = await computadora.findOne({where: {id: req.params.id, activo: true}});
    res.status(200).json(computadoras);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

//Ruta para obtener las computadoras. (admin)
routerComputadora.get("/admin/computadoras", async (req, res) => {
  try {
    const computadoras = await computadora.findAll();
    res.status(200).json(computadoras);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

module.exports = routerComputadora;