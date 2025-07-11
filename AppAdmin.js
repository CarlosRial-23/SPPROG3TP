const { sequelize } = require("./ORM/database/index.js");
const express = require("express");
const path = require("path");
const cors = require("cors");
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
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "pagesAdmin")));
app.use("/api", productosRouter);



// Montar rutas
app.use("/productos", productoRoutes);
app.use("/ventas", ventaRoutes);
app.use("/tickets", ticketRoutes);
app.use("/api/productos", require("./rutas/apiProductos"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración del motor de plantillas (view engine) para usar EJS
app.set('view engine', 'ejs');

// Establecer la carpeta 'views' como el directorio donde están las vistas
app.set('views', path.join(__dirname, 'vistas')); // Aquí estamos usando 'vistas' en lugar de 'views'

// Ruta para renderizar el formulario de edición
app.get('/editar-producto/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    // Si no se encuentra el producto, devolver un error 404
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    // Si el producto se encuentra, renderiza la vista 'editarProducto' con los datos del producto
    res.render('editarProducto', { producto });  // renderiza la vista en la carpeta 'vistas'
  } catch (error) {
    console.error('Error al obtener producto para editar:', error);
    res.status(500).send('Error interno del servidor');
  }
});


/* Rutas estáticas
app.use("/", express.static("public/pages"));
app.use("/productos",express.static(path.join(__dirname, "public", "pages", "productos.html")));
app.use("/carrito", express.static(path.join(__dirname, "public", "pages", "carrito.html")));*/

app.use("/", express.static("public/pagesAdmin"));
//app.use("/dashboard",express.static(path.join(__dirname, "public", "pagesAdmin", "dashboard.html")));
// Para servir dashboard.html
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public","pagesAdmin", "dashboard.html"));
});
app.use("/ventas",express.static(path.join(__dirname, "public", "pagesAdmin", "informacionVentas.html")));
app.use("/alta",express.static(path.join(__dirname, "public", "pagesAdmin", "altaProducto.html")));

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
