const { Venta, DetalleVenta, Producto } = require('./modelos');

function establecerRelaciones() {
  // 1. Venta -> DetalleVenta (1:N)
  Venta.hasMany(DetalleVenta, {
    foreignKey: 'venta_id',
    as: 'detallesDeVenta'  // Alias único
  });

  // 2. DetalleVenta -> Venta (N:1)
  DetalleVenta.belongsTo(Venta, {
    foreignKey: 'venta_id',
    as: 'ventaPadre'  // Alias único
  });

  // 3. Producto -> DetalleVenta (1:N)
  Producto.hasMany(DetalleVenta, {
    foreignKey: 'producto_id',
    as: 'ventasDeProducto'  // Alias único
  });

  // 4. DetalleVenta -> Producto (N:1)
  DetalleVenta.belongsTo(Producto, {
    foreignKey: 'producto_id',
    as: 'productoRelacionado'  // Alias único
  });

  console.log("Relaciones establecidas correctamente con alias únicos");
}

module.exports = { establecerRelaciones };