const cookieParser = require('cookie-parser');
require('dotenv').config();
const sequelize = require("./database/index.js");
const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

const productosRouter = require("./rutas/apiProductos.js");
const productoRoutes = require("./rutas/productos.js");
const ventaRoutes = require("./rutas/ventas.js");
const ticketRoutes = require("./rutas/tickets.js");
const authRoutes = require('./rutas/authRutas.js');
const { establecerRelaciones } = require("./model/relaciones.js");
const { authMiddleware, adminMiddleware } = require('./middlewares/auth.js');
const port = 3000;

// Importa los modelos
const { Ticket } = require("./model/ticket.js");
const { Producto, Venta, DetalleVenta } = require("./model/modelos.js");
const { inicializarBD } = require("./database/inicializarBD.js");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); 
app.use(express.static(path.join(__dirname, "public")));
app.use("/login", express.static(path.join(__dirname, "public","pagesAdmin")));
app.use("/api", productosRouter);
app.use('/auth', authRoutes);

// Montar rutas
app.use("/producto", productoRoutes);
app.use("/ventas", ventaRoutes);
app.use("/tickets", ticketRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Añadir ruta para uploads
//app.use("/", express.static("public/pagesAdmin"));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));

app.get('/editar-producto/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('editarProducto', { producto });
  } catch (error) {
    console.error('Error al obtener producto para editar:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pagesAdmin", "dashboard.html"));
});

app.get("/ventasInforme", authMiddleware, adminMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pagesAdmin", "informacionVentas.html"));
});

app.get("/alta", authMiddleware, adminMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pagesAdmin", "altaProducto.html"));
});

//Rutas estáticas para páginas normales (mantenidas de App.js original)

app.use("/", express.static(path.join(__dirname, "public", "pages")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "index.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "productos.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pagesAdmin", "indexAdmin.html"));
});
app.use("/productos", express.static(path.join(__dirname, "public", "pages", "productos.html")));
app.use("/carrito", express.static(path.join(__dirname, "public", "pages", "carrito.html")));
app.use(cookieParser());
// Iniciar servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida.");

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados correctamente");

    await inicializarBD();

    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();