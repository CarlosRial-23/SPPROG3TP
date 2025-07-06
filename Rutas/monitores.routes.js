const express = require('express');
const routerMonitor = express.Router();
const monitor = require('../Modelo/monitor')

routerMonitor.get("/monitores/:id", async (req, res) => {
  try {
    const monitores = await monitor.findOne({where: {id: req.params.id, activo: true}});
    res.status(200).json(monitores);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});


//Ruta para obtener los monitores. (admin)
routerMonitor.get("/admin/monitores", async (req, res) => {
  try {
    const monitores = await monitor.findAll();
    res.status(200).json(monitores);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

module.exports = routerMonitor;

