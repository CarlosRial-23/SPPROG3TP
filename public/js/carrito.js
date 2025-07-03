document.addEventListener("DOMContentLoaded", () => {
  const carritoContainer = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");
  const confirmarBtn = document.getElementById("btn-confirmar");

  function getCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  }

  function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function calcularTotal(carrito) {
    return carrito
      .reduce((sum, item) => sum + item.precio * item.cantidad, 0)
      .toFixed(2);
  }

  function actualizarVistaCarrito() {
    const carrito = getCarrito();
    carritoContainer.innerHTML = "";
    actualizarContadorCarrito();

    if (carrito.length === 0) {
      carritoContainer.innerHTML = "<p>El carrito está vacío.</p>";
      totalSpan.textContent = "0";
      return;
    }

    carrito.forEach((producto, indice) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      const card = document.createElement("div");
      card.className = "card h-100";
      card.dataset.id = producto.id; // Agregar data-id
      card.dataset.precio = producto.precio; // Agregar data-precio

      const img = document.createElement("img");
      img.src = producto.url_imagen;
      img.className = "card-img-top";
      img.alt = producto.nombre;

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const title = document.createElement("h5");
      title.className = "card-title";
      title.textContent = producto.nombre;

      const cantidad = document.createElement("p");
      cantidad.className = "card-text cantidad"; // Agregar clase 'cantidad'
      cantidad.textContent = `Cantidad: ${producto.cantidad}`;

      const precio = document.createElement("p");
      precio.className = "card-text fw-bold";
      precio.textContent = `$ ${producto.precio.toFixed(2)} c/u`;

      const subtotal = document.createElement("p"); // Elemento para subtotal
      subtotal.className = "card-text subtotal fw-bold"; // Agregar clase 'subtotal'
      subtotal.textContent = `Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}`;

      const btnGroup = document.createElement("div");
      btnGroup.className = "btn-group mt-2";

      const btnAdd = document.createElement("button");
      btnAdd.textContent = "+";
      btnAdd.className = "btn btn-sm btn-success";
      btnAdd.addEventListener("click", () => {
        producto.cantidad++;
        guardarCarrito(carrito);
        actualizarVistaCarrito();
      });

      const btnRemove = document.createElement("button");
      btnRemove.textContent = "-";
      btnRemove.className = "btn btn-sm btn-danger";
      btnRemove.addEventListener("click", () => {
        producto.cantidad--;
        if (producto.cantidad <= 0) {
          carrito.splice(indice, 1);
        }
        guardarCarrito(carrito);
        actualizarVistaCarrito();
      });

      btnGroup.appendChild(btnAdd);
      btnGroup.appendChild(btnRemove);

      cardBody.append(title, cantidad, precio, subtotal, btnGroup);
      card.append(img, cardBody);
      col.appendChild(card);
      carritoContainer.appendChild(col);
    });

    totalSpan.textContent = calcularTotal(carrito);
  }

  function actualizarContadorCarrito() {
    const carrito = getCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
      contador.textContent = totalItems;
    }
  }

  // Event listener CORREGIDO para el botón de confirmar
  if (confirmarBtn) {
    confirmarBtn.addEventListener("click", async () => {
      // Obtener usuario de localStorage
      const usuario = localStorage.getItem("nombreUsuario") || "invitado";

      // Obtener productos directamente del localStorage
      const carrito = getCarrito();
      const productos = carrito.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.precio * item.cantidad
      }));

      // Calcular total
      const total = calcularTotal(carrito);

      try {
        const response = await fetch("/ventas/exitosa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario, productos, total }),
        });

        if (response.ok) {
          const data = await response.json();
          alert("¡Compra realizada con éxito!");
          
          // Limpiar carrito y redirigir al ticket
          localStorage.removeItem("carrito");
          window.location.href = `/ticket/${data.id}`;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error en el servidor");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(`Error al confirmar la compra: ${error.message}`);
      }
    });
  }

  actualizarVistaCarrito();
});