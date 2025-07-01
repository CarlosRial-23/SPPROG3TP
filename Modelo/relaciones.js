const computadora = require('./computadora.js');
const monitor = require('./monitor.js');
const venta = require('./venta.js');
const ventasProductos = require('./venta_producto.js');

ventasProductos.belongsTo(computadora, { foreignKey: 'id_computadora' });
ventasProductos.belongsTo(monitor, { foreignKey: 'id_monitor' });
ventasProductos.belongsTo(venta, { foreignKey: 'id_venta' });

computadora.hasMany(ventasProductos, { foreignKey: 'id_computadora' });
monitor.hasMany(ventasProductos, { foreignKey: 'id_monitor' });
venta.hasMany(ventasProductos, { foreignKey: 'id_venta' });

module.exports = {
  computadora,
  monitor,
  venta,
  ventasProductos
};