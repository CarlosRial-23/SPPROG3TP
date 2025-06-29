const { getCarrito } = require("./productos");

document.addEventListener("DOMContentLoaded", () => {
  const carritoContainer = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");

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
      cantidad.className = "card-text";
      cantidad.textContent = `Cantidad: ${producto.cantidad}`;

      const precio = document.createElement("p");
      precio.className = "card-text fw-bold";
      precio.textContent = `$ ${producto.precio} c/u`;

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

      cardBody.append(title, cantidad, precio, btnGroup);
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

  // Simula la compra
  const realizarCompra = () => {
    alert("Compra realizada con éxito");
    localStorage.removeItem("carrito");
    window.location.href = "index.html";
  };

  actualizarVistaCarrito();
});

module.exports = {getCarrito};