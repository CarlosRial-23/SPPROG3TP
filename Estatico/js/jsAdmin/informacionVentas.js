document.addEventListener("DOMContentLoaded", () => {
  cargarVentas();
});

async function cargarVentas() {
  try {
    const res = await fetch("/admin/ventas-productos");
    const ventas = await res.json();

    const tbody = document.getElementById("t_body_ventas");
    tbody.innerHTML = "";

    ventas.forEach((ventaProducto) => {
      // Definir los datos que necesitas mostrar:
      const idRegistro = ventaProducto.id;
      const idVenta = ventaProducto.id_venta;
      const fechaVenta = new Date(ventaProducto.venta.fecha).toLocaleDateString();
      const tipoProducto = ventaProducto.tipo_producto;

      // El producto puede venir desde computadora o monitor, según tipo_producto:
      let nombreProducto = "";
      let urlImagen = "";
      let precioUnitario = 0;

      if (tipoProducto === "computadora" && ventaProducto.computadora) {
        nombreProducto = ventaProducto.computadora.nombre;
        urlImagen = ventaProducto.computadora.url_imagen;
        precioUnitario = ventaProducto.computadora.precio;
      } else if (tipoProducto === "monitor" && ventaProducto.monitor) {
        nombreProducto = ventaProducto.monitor.nombre;
        urlImagen = ventaProducto.monitor.url_imagen;
        precioUnitario = ventaProducto.monitor.precio;
      }

      const cantidad = ventaProducto.cantidad;
      const subtotal = precioUnitario * cantidad;
      const totalVenta = ventaProducto.venta
        ? ventaProducto.venta.precio_total
        : 0;

      // Crear fila de tabla
      const tr = document.createElement("tr");

      tr.innerHTML = `
      <td>${idRegistro}</td>
      <td>${idVenta}</td>
      <td>${fechaVenta}</td>
      <td>${tipoProducto}</td>
      <td>${nombreProducto}</td>
      <td><img src="${urlImagen}" alt="${nombreProducto}" style="max-width: 100px; max-height: 50px;"></td>
      <td>$${precioUnitario.toFixed(2)}</td>
      <td>${cantidad}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td>$${totalVenta.toFixed(2)}</td>
    `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.log("Error", error);
  }
}
