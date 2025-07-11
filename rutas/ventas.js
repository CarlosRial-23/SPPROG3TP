const express = require("express");
const { Producto, Venta, DetalleVenta } = require("../model/modelos");
const { DataTypes } = require("sequelize");
const sequelize  = require('../database/index.js');

// Rutas de ventas
const ventaRoutes = express.Router();

ventaRoutes.get("/", async (req, res) => {
  try {
    const venta = await Venta.findAll();
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

ventaRoutes.get("/:id", async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [
        {
          model: DetalleVenta,
          as: "detallesDeVenta",
          include: [
            {
              model: Producto,
              as: "productoRelacionado",
            },
          ],
        },
      ],
    });
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

ventaRoutes.post("/", async (req, res) => {
  try {
    const newVenta = await Venta.create(req.body);
    res.status(201).json(newVenta);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

ventaRoutes.post("/exitosa", async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { usuario, productos, total } = req.body;

    const nuevaVenta = await Venta.create(
      {
        usuario,
        fecha: new Date(),
        total,
      },
      { transaction: t }
    );

    const detalles = productos.map((p) => ({
      venta_id: nuevaVenta.id,
      producto_id: p.id,
      cantidad: p.cantidad,
      precio_unitario: p.precio,
      subtotal: p.subtotal,
    }));

    await DetalleVenta.bulkCreate(detalles, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: "Venta registrada",
      id: nuevaVenta.id,
      total: nuevaVenta.total,
    });
  } catch (error) {
    await t.rollback();
    res
      .status(500)
      .json({ error: "Error al procesar venta: " + error.message });
  }
});

module.exports = ventaRoutes;