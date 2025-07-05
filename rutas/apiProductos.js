const express = require('express');
const router = express.Router(); 
const { Producto } = require('../ORM/model/modelos');

router.get('/productos', async (req, res) => {
  try {
    
    const productos = await Producto.findAll({
      where: { activo: true },
      raw: true 
    });
        
    const productosConPrecioNumerico = productos.map(p => ({
      ...p,
      precio: parseFloat(p.precio)
    }));
    
    res.json(productosConPrecioNumerico);
  } catch (error) {
    console.error('Error completo:', error); 
    res.status(500).json({ 
      error: 'Error al obtener los productos',
      detalles: error.message 
    });
  }
});

module.exports = router;