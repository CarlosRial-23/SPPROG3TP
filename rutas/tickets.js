const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const { Producto, Venta, DetalleVenta } = require("../model/modelos");

const ticketRoutes = express.Router();

ticketRoutes.get("/:id", async (req, res) => {
  try {
    const ventaId = req.params.id;
    const venta = await Venta.findByPk(ventaId, {
      include: [{
        model: DetalleVenta,
        as: "detallesDeVenta",
        include: [{
          model: Producto,
          as: "productoRelacionado"
        }]
      }]
    });
    
    if (!venta) {
      return res.status(404).send('Venta no encontrada');
    }

    const ticket = {
      id: venta.id,
      fecha: venta.fecha.toISOString().split('T')[0],
      nombre: venta.usuario,
      productos: venta.detallesDeVenta.map(d => ({
        nombre: d.productoRelacionado.nombre,
        precio: d.precio_unitario,
        cantidad: d.cantidad
      })),
      total: venta.total,
      view: true
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "..", "vistas", "ticket.ejs"),
      { ticket }
    );
    
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Error al generar ticket: ' + error.message);
  }
});

ticketRoutes.get("/download/:id", async (req, res) => {
  try {
    const ventaId = req.params.id;
    const venta = await Venta.findByPk(ventaId, {
      include: [{
        model: DetalleVenta,
        as: "detallesDeVenta",
        include: [{
          model: Producto,
          as: "productoRelacionado"
        }]
      }]
    });

    if (!venta) {
      return res.status(404).send("Venta no encontrada");
    }

    const ticket = {
      id: venta.id,
      fecha: venta.fecha.toLocaleDateString(),
      nombre: venta.usuario,
      productos: venta.detallesDeVenta.map((d) => ({
        nombre: d.productoRelacionado.nombre,
        precio: d.precio_unitario,
        cantidad: d.cantidad,
      })),
      total: venta.total,
      view: false,
    };

    const cssPath = path.join(__dirname, "..","public", "css", "ticket.css");
    const css = fs.readFileSync(cssPath, "utf8");

    let html = await ejs.renderFile(
      path.join(__dirname, "..", "vistas", "ticket.ejs"),
      { ticket }
    );

    const styleTag = `<style>${css}</style>`;
    html = html.replace("</head>", `${styleTag}</head>`);

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "5px", right: "5px", bottom: "5px", left: "5px" },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=ticket_${ventaId}.pdf`,
    });
    res.status(200).send(pdfBuffer);
  } catch (error) {
    res.status(500).send("Error al descargar ticket: " + error.message);
  }
});

module.exports = ticketRoutes;