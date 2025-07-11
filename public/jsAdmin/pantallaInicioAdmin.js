function clickerBtnIngresar() {
  const inicio = document.getElementById("inicio");
  const params = new URLSearchParams(window.location.search);
  if (params.has('error')) {
    alert("Error de autenticación: " + params.get('error'));
  }
}
async function obtenerProductos() {
  try {
    const response = await fetch('/productos');
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarTabla("tablaProductos");})

async function renderizarTabla(tableBody) {
  try {
    const res = obtenerProductos();
    const productos = await res.json();

    const tbody = document.getElementById(tableBody);
    tbody.innerHTML = "";

    productos.forEach(e => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.id}</td>
        <td>${e.nombre}</td>
        <td><img src="${e.url_imagen}" alt="${e.nombre}" width="50"></td>
        <td>${e.precio}</td>
        <td>${e.cantidad}</td>
        <td>${e.activo}</td>        
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarProducto(${e.id}, '${e.nombre}', '${e.precio}', '${e.url_imagen}', '${e.cantidad}', ${e.activo})">
             Editar
          </button>
          
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.log("Error al cargar el producto", error);
  }
}
