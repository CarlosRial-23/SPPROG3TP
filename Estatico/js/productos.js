const pcContainer = document.getElementById("pc");
const monitorContainer = document.getElementById("monitor");

// Obtener el carrito desde localStorage
function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Guardar el carrito en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Crear una tarjeta de producto
function crearTarjeta(producto) {
  const col = document.createElement("div");
  col.className = "col";

  const card = document.createElement("div");
  card.className = "card h-100 product-card";

  const img = document.createElement("img");
  img.src = producto.url_imagen || "https://via.placeholder.com/150";
  img.className = "card-img-top product-img";
  img.alt = producto.nombre;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = producto.nombre;

  const price = document.createElement("p");
  price.className = "card-text fw-bold";
  price.textContent = `$ ${producto.precio.toFixed(2)}`;

  const btnGroup = document.createElement("div");
  btnGroup.className = "d-flex justify-content-between";

  const btnAdd = document.createElement("button");
  btnAdd.className = "btn btn-success btn-add";
  btnAdd.textContent = "Agregar";

  const btnRemove = document.createElement("button");
  btnRemove.className = "btn btn-danger";
  btnRemove.textContent = "Quitar";
 
  // Evento para agregar al carrito
  btnAdd.addEventListener("click", () => {
    const carrito = getCarrito();
    const existing = carrito.find(
      (item) => item.id === producto.id && item.nombre === producto.nombre
    );
    if (existing) {
      existing.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    alert("Producto agregado al carrito");
  });

  // Evento para quitar del carrito
  btnRemove.addEventListener("click", () => {
    let carrito = getCarrito();
    const indice = carrito.findIndex(
      (item) => item.id === producto.id && item.nombre === producto.nombre
    );
    if (indice !== -1) {
      if (carrito[indice].cantidad > 1) {
        carrito[indice].cantidad--;
      } else {
        carrito.splice(indice, 1);
      }
      guardarCarrito(carrito);
      actualizarContadorCarrito();
      alert("Producto eliminado del carrito");
    }
  });

  btnGroup.appendChild(btnAdd);
  btnGroup.appendChild(btnRemove);

  cardBody.append(title, price, btnGroup);
  card.append(img, cardBody);
  col.appendChild(card);

  return col;
}

// Cargar productos al inicio desde JSON
function cargarProductos() {
    pcContainer.innerHTML = "";
    monitorContainer.innerHTML = "";
    fetch("js/pcs.json")
        .then((response) => response.json()) // Convierte la respuesta en JSON
        .then((data) => {
            data.pcs.forEach (elemento => {
                const card = crearTarjeta(elemento);
                pcContainer.appendChild(card);
            })
        
    })
    .catch((error) => console.error("Error al cargar el archivo JSON:", error));

    fetch("js/monitores.json")
        .then((response) => response.json()) // Convierte la respuesta en JSON
        .then((data) => {
            data.monitores.forEach (elemento => {
                const card = crearTarjeta(elemento);
                monitorContainer.appendChild(card);
        })
        
    })
    .catch((error) => console.error("Error al cargar el archivo JSON:", error));
}

function actualizarContadorCarrito() {
    const carrito = getCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
      if (contador) {
        contador.textContent = totalItems;
      }
  }

cargarProductos();
actualizarContadorCarrito();