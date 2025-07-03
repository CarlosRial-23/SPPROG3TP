const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

const { sequelize } = require("./database/index.js");
const { Producto } = require("./model/producto.js");
const { Venta } = require("./model/venta.js");
const { DetalleVenta } = require("./model/detalleVenta.js");

// uno a muchos - Asociaciones
Venta.hasMany(DetalleVenta, {
    foreignKey: 'venta_id',
    as: 'detalles'
});

DetalleVenta.belongsTo(Venta, {
    foreignKey: 'venta_id',
    as: 'venta'
});

DetalleVenta.belongsTo(Producto, {
    foreignKey: "producto_id",
    as: "producto"
});

app.get("/producto", async (req, res) => {
  try {
    const Prod = await Producto.findAll();
    res.status(200).json(Prod);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

app.get("/producto/:id", async (req, res) => {
  try {
    const Prod = await Producto.findByPk(req.params.id);
    res.status(200).json(Prod);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

app.post("/producto", async (req, res) => {
  try {
    const newProducto = await Producto.create(req.body);
    res.status(201).json(newProducto);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

//VENTAS

app.get("/ventas", async (req, res) => {
  try {
    const venta = await Venta.findAll();
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

app.get("/ventas/:id", async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

app.post("/ventas", async (req, res) => {
  try {
    const newVenta = await Venta.create(req.body);
    res.status(201).json(newVenta);
  } catch (error) {
    res.status(500).json({ error: "Error en la consulta" });
  }
});

app.post("/ventas/completar", async (req, res) => {
  const tra = await sequelize.transaction();
  
  try {
    const { usuario, productos, total } = req.body;
    
    // Crear venta principal
    const nuevaVenta = await Venta.create({
      usuario,
      fecha: new Date(),
      total
    }, { transaction: tra }); 

    // Crear detalles de venta
    const detalles = productos.map(p => ({
      venta_id: nuevaVenta.id,
      producto_id: p.id,
      cantidad: p.cantidad,
      precio_unitario: p.precio,
      subtotal: p.subtotal
    }));

    await DetalleVenta.bulkCreate(detalles, { transaction: tra });
    
    await tra.commit();
    res.status(201).json({ message: "Venta registrada", id: nuevaVenta.id });
    
  } catch (error) {
    await tra.rollback();
    res.status(500).json({ error: "Error al procesar venta: " + error.message });
  }
});

sequelize
  .sync({ alter: true }) // force: true -> Elimina y vuelve a crear las tablas y alter: true
  .then(() => {
    console.log(`Databa connected successfully.`);
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);

  });
