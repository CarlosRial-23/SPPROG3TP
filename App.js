const { sequelize } = require("./ORM/database/index.js");
const express = require("express");
const path = require("path");
const app = express();
const productosRouter = require("./rutas/apiProductos.js");
const productoRoutes = require("./rutas/productos.js");
const ventaRoutes = require("./rutas/ventas.js");
const ticketRoutes = require("./rutas/tickets.js");
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

// Montar rutas
app.use("/producto", productoRoutes);
app.use("/ventas", ventaRoutes);
app.use("/tickets", ticketRoutes);

// Rutas estáticas
app.use("/", express.static("public/pages"));
app.use("/productos",express.static(path.join(__dirname, "public", "pages", "productos.html")));
app.use("/carrito", express.static(path.join(__dirname, "public", "pages", "carrito.html")));

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
