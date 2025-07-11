const express = require('express');
const routerMonitor = express.Router();
const monitor = require('../Modelo/monitor')
const path = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..','Estatico', 'images', 'Uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });


routerMonitor.get("/monitores/:id", async (req, res) => {
  try {
    const monitores = await monitor.findOne({where: {id: req.params.id, activo: true}});
    res.status(200).json(monitores);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});


//Ruta para obtener los monitores. (admin)
routerMonitor.get("/admin/monitores", async (req, res) => {
  try {
    const monitores = await monitor.findAll();
    res.status(200).json(monitores);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

routerMonitor.patch("/admin/monitores/:id/estado", async(req,res)=>{
  const{id} = req.params;
  const {activo} = req.body; 
  console.log("ID:", id);
  console.log("ACtivo:", activo);
  try{
    const [actualizado] = await monitor.update({activo}, {where: {id}});
    if(actualizado === 0) return res.status(404).json({error: "monitor no encontrada"});

    const monitorActualizado = await monitor.findOne({where: {id}});
    res.json({monitorActualizado});

  }catch (error){
    console.error('Error al actualizar el estado de la monitor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
})

routerMonitor.get('/admin/modificarMonitor', (req, res) => {
 res.sendFile(path.join(__dirname, '../Admin/src/pagesAdmin/modificarProducto.html'));

});

routerMonitor.post('/admin/monitores/modificar-producto', upload.single('archivo'), async (req, res) => {
  try {
    const { id, tipo, nombre, precio, cantidad } = req.body;
    if (!id || tipo !== 'monitor') {
      return res.status(400).send('Producto inválido o tipo no corresponde a monitor');
    }

    const dataToUpdate = { nombre, precio, cantidad };

    if (req.file) {
      dataToUpdate.url_imagen = `/images/Uploads/${req.file.filename}`;
    }

    const [updated] = await monitor.update(
      dataToUpdate,
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).send('Monitor no encontrado');
    }

    res.redirect('/admin/modificarproducto');
  } catch (error) {
    console.error('Error al modificar monitor:', error);
    res.status(500).send('Error interno al modificar monitor');
  }
});

module.exports = routerMonitor;

