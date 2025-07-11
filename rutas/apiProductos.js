const express = require("express");
const router = express.Router();
const path = require("path");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const { Producto } = require("../ORM/model/modelos.js");
const { sequelize } = require("../ORM/database/index.js");
const { grabarProducto } = require("../ORM/database/funcionesInicializarBD.js");
const upload = require("../middlewares/multerConfig.js");


/// Configuración de rutas 

router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll({
      raw: true,
    });

    const productosConPrecioNumerico = productos.map((p) => ({
      ...p,
      precio: parseFloat(p.precio),
    }));

    res.json(productosConPrecioNumerico);
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({
      error: "Error al obtener los productos",
      detalles: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const Prod = await Producto.findByPk(req.params.id);
    res.status(200).json(Prod);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

router.put("/:id/baja", async (req, res) => {
  const id = req.params.id;

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await producto.update({ activo: false });

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar producto", detalles: error.message });
  }
});
router.put("/:id/activar", async (req, res) => {
  const id = req.params.id;

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await producto.update({ activo: true });

    res.status(200).json({ message: "Producto activado correctamente" });
  } catch (error) {
    console.error("Error al activar el producto:", error);
    res
      .status(500)
      .json({ error: "Error al activar producto", detalles: error.message });
  }
});

router.post('/', upload.single('imagenProducto'), async (req, res) => {
  try {
    const { nombre, precio, cantidad, categoria, activo } = req.body;
    const url_imagen = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!nombre || !precio || !cantidad || !categoria || !url_imagen) {
      return res.status(400).json({ error: "Todos los campos son obligatorios, incluyendo la imagen" });
    }

    const producto = await Producto.create({
      nombre,
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
      categoria,
      activo: activo === "1", 
      url_imagen
    });

    console.log("Producto guardado correctamente");
    res.status(201).json(producto);

  } catch (error) {
    console.error("Error al guardar producto:", error);
    res.status(500).json({ error: "Error interno", detalles: error.message });
  }
});

router.put('/:id/editar', upload.single('imagenProducto'), async (req, res) => {
  const { id } = req.params;
  // Para FormData, los valores vienen como strings
  const { nombre, precio, cantidad, activo, categoria } = req.body;
  const imagen = req.file ? req.file.filename : null;

  try {
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updates = {
      nombre: nombre || producto.nombre,
      precio: precio ? parseFloat(precio) : producto.precio,
      cantidad: cantidad ? parseInt(cantidad) : producto.cantidad,
      activo: activo ? activo === "1" : producto.activo,
      categoria: categoria || producto.categoria,
      url_imagen: imagen ? `/uploads/${imagen}` : producto.url_imagen,
    };

    await producto.update(updates);

    // Devuelve JSON en lugar de redireccionar
    res.json({ 
      success: true,
      message: "Producto actualizado correctamente",
      producto: producto 
    });
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({ 
      error: "Error al actualizar el producto",
      details: error.message 
    });
  }
});


module.exports = router;
