const { sequelize } = require("./ORM/database/index.js");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const productosRouter = require("./rutas/apiProductos.js");
const { establecerRelaciones } = require("./ORM/model/relaciones.js");
const port = 3000;

// Importa los modelos
const { Ticket } = require("./ORM/model/ticket.js");
const { Producto, Venta, DetalleVenta } = require("./ORM/model/modelos.js");
const { inicializarBD } = require("./ORM/database/inicializarBD.js");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", productosRouter);

// Rutas de productos
const productoRoutes = express.Router();
app.use(
  "/productos",
  express.static(path.join(__dirname, "public", "pages", "productos.html"))
);

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

// Rutas de tickets
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
      path.join(__dirname, "public", "vistas", "ticket.ejs"),
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

    const cssPath = path.join(__dirname, "public", "css", "ticket.css");
    const css = fs.readFileSync(cssPath, "utf8");

    let html = await ejs.renderFile(
      path.join(__dirname, "public", "vistas", "ticket.ejs"),
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

// Montar rutas
app.use("/producto", productoRoutes);
app.use("/ventas", ventaRoutes);
app.use("/ticket", ticketRoutes);

// Rutas estáticas
app.use("/", express.static("public/pages"));
app.use(
  "/productos",
  express.static(path.join(__dirname, "public", "pages", "productos.html"))
);
app.use(
  "/carrito",
  express.static(path.join(__dirname, "public", "pages", "carrito.html"))
);

// Iniciar servidor
async function startServer() {
  try {
    // 1. Autenticar la conexión
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida.");

    // 2. Establecer relaciones
    establecerRelaciones();

    // 3. Inicializar la base de datos
    await inicializarBD();

    // 4. Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
