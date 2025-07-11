function cargarProductoDesdeStorage() {
  const productoJSON = localStorage.getItem('productoAModificar');
  if (!productoJSON) {
    alert('No se encontró producto a modificar');
    return;
  }

  const producto = JSON.parse(productoJSON);

  document.getElementById('productoId').value = producto.id;
  document.querySelector('select[name="tipo"]').value = producto.tipo || 'computadora';
  document.querySelector('input[name="nombre"]').value = producto.nombre || '';
  document.querySelector('input[name="precio"]').value = producto.precio || '';
  document.querySelector('input[name="cantidad"]').value = producto.cantidad || '';

  document.getElementById('infoId').textContent = producto.id;
  document.getElementById('infoTipo').textContent = producto.tipo || '-';
  document.getElementById('infoNombre').textContent = producto.nombre || '-';
  document.getElementById('infoPrecio').textContent = producto.precio || '-';
  document.getElementById('infoCantidad').textContent = producto.cantidad || '-';
  if (producto.url_imagen) {
    const img = document.getElementById('infoImagen');
    img.src = producto.url_imagen;
    img.alt = producto.nombre;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  cargarProductoDesdeStorage();

  const form = document.getElementById('formModificar');
  const tipoSelect = form.querySelector('select[name="tipo"]');

  form.addEventListener('submit', (e) => {
    const tipo = tipoSelect.value;
    if (tipo === 'computadora') {
      form.action = '/admin/computadoras/modificar-producto';
    } else if (tipo === 'monitor') {
      form.action = '/admin/monitores/modificar-producto';
    }
  });
});