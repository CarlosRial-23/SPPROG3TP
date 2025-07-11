const express = require("express");
const { Producto, Venta, DetalleVenta } = require("../model/modelos");

// Rutas de productos
const productoRoutes = express.Router();
exports.productoRoutes = productoRoutes;

productoRoutes.get("/productos", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "pages", "productos.html"));
});


module.exports = productoRoutes;