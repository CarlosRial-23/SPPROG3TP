const express = require('express');
const routerComputadora = express.Router();
const computadora = require("../Modelo/computadora");
const path = require('path');
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

routerComputadora.post('/admin/computadoras/modificar-producto', upload.single('archivo'), async (req, res) => {
  try {
    const { id, tipo, nombre, precio, cantidad } = req.body;
    if (!id || tipo !== 'computadora') {
      return res.status(400).send('Producto inválido o tipo no corresponde a computadora');
    }

    const dataToUpdate = { nombre, precio, cantidad };

    if (req.file) {
      dataToUpdate.url_imagen = `/images/Uploads/${req.file.filename}`;
    }

    const [updated] = await computadora.update(
      dataToUpdate,
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).send('Computadora no encontrada');
    }

    res.redirect('/admin/modificarproducto');
  } catch (error) {
    console.error('Error al modificar computadora:', error);
    res.status(500).send('Error interno al modificar computadora');
  }
});

routerComputadora.get("/computadoras/:id", async (req, res) => {
  try {
    const computadoras = await computadora.findOne({where: {id: req.params.id, activo: true}});
    res.status(200).json(computadoras);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

//Ruta para obtener las computadoras. (admin)
routerComputadora.get("/admin/computadoras", async (req, res) => {
  try {
    const computadoras = await computadora.findAll();
    res.status(200).json(computadoras);
  } catch (e) {
    res.status(500).json({ e: "Error en la consulta" });
  }
});

routerComputadora.patch("/admin/computadoras/:id/estado", async(req,res)=>{
  const{id} = req.params;
  const {activo} = req.body; 
  console.log("ID:", id);
  console.log("ACtivo:", activo);
  try{
    const [actualizado] = await computadora.update({activo}, {where: {id}});
    if(actualizado === 0) return res.status(404).json({error: "Computadora no encontrada"});

    const computadoraActualizada = await computadora.findOne({where: {id}});
    res.json({computadoraActualizada});

  }catch (error){
    console.error('Error al actualizar el estado de la computadora:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
})

routerComputadora.get('/admin/modificarComputadora', (req, res) => {
  res.sendFile(path.join(__dirname, '../Admin/src/pagesAdmin/modificarProducto.html'));

});


module.exports = routerComputadora;