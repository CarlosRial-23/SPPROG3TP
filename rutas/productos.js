const express = require("express");
const { Producto, Venta, DetalleVenta } = require("../ORM/model/modelos");

// Rutas de productos
const productoRoutes = express.Router();

productoRoutes.get("/productos", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "pages", "productos.html"));
});

productoRoutes.get("/", async (req, res) => {
  try {
    const Prod = await Producto.findAll();
    res.status(200).json(Prod);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

productoRoutes.get("/:id", async (req, res) => {
  try {
    const Prod = await Producto.findByPk(req.params.id);
    res.status(200).json(Prod);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

productoRoutes.post("/api/productos", async (req, res) => {
  try {
    const newProducto = await Producto.create(req.body);
    res.status(201).json(newProducto);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

module.exports = productoRoutes;