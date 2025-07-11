document.addEventListener('DOMContentLoaded', async function () {
  const altaBtn = document.getElementById("btn-alta");
  const eliminarBtn = document.getElementById("btn-eliminar");
  const activarBtn = document.getElementById("btn-activar");

  // Cargar productos si estás en el dashboard
  const productos = await obtenerProductos();
  renderizarProductos(productos);

  // Botón para ir a la página de alta
  if (altaBtn) {
    altaBtn.addEventListener("click", () => {
      window.location.href = "/alta";
    });
  }
  
  // Interceptar el submit del formulario de alta y redirigir a dashboard
  const form = document.getElementById('formAltaProducto');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(form);

      try {
        const response = await fetch('/api', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Producto guardado:", result);
          window.location.href = "/dashboard"; // Redirige al dashboard
        } else {
          const error = await response.json();
          alert("Error al guardar producto: " + error.error);
        }
      } catch (err) {
        console.error("Error de red o servidor:", err);
        alert("Error de red. Intente nuevamente.");
      }
    });
  }
});

// Función para cargar y mostrar los productos
  async function obtenerProductos() {
    try {
      const response = await fetch('/api/admin');
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

// Función para renderizar los productos en la tabla
  function renderizarProductos(productos) {
    const tbody = document.getElementById('t_body_productos');
    if (!tbody) return; // Evita errores si no hay tabla en la página
    tbody.innerHTML = '';

    productos.forEach(producto => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td><img src="${producto.url_imagen}" alt="${producto.nombre}" style="max-width: 100px;"></td>
        <td>$${producto.precio.toFixed(2)}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.activo ? "Sí" : "No"}</td>
        <td>
          <button class="btn btn-success btn-lg" onclick="editarProducto(${producto.id})">Editar</button>
          <button class="btn btn-warning btn-lg" onclick="activarProducto(${producto.id})">Activar</button>
          <button class="btn btn-danger btn-lg" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  }


async function eliminarProducto(id, estadoProducto) {
  
  const confirmacion = confirm("¿Estás seguro de que deseas marcar este producto como inactivo?");
  if (!confirmacion) return;

  try {
    const response = await fetch(`/api/${id}/baja`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert("Producto marcado como inactivo correctamente.");

      const productos = await obtenerProductos();
      renderizarProductos(productos);
    } else {
      const error = await response.json();
      alert("Error al marcar el producto como inactivo: " + (error.message || response.status));
    }
  } catch (error) {
    console.error("Error al marcar el producto como inactivo:", error);
    alert("Ocurrió un error al intentar marcar el producto como inactivo.");
  }
}

async function activarProducto(id, estadoProducto) {
  
  try {
    const response = await fetch(`/api/${id}/activar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert("Producto marcado como activo correctamente.");

      const productos = await obtenerProductos();
      renderizarProductos(productos);
    } else {
      const error = await response.json();
      alert("Error al marcar el producto como activo: " + (error.message || response.status));
    }
  } catch (error) {
    console.error("Error al marcar el producto como activo:", error);
    alert("Ocurrió un error al intentar marcar el producto como activo.");
  }
}

async function editarProducto(id) {
  
  window.location.href = `/editar-producto/${id}`;

}
