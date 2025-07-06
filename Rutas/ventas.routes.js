const express = require('express');
const routerVentas = express.Router();
const { computadora, monitor, venta, ventasProductos } = require("../Modelo/relaciones.js");


routerVentas.get("/admin/ventas-productos", async (req,res)=>{
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

module.exports = routerVentas;