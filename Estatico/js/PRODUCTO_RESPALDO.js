const pcContainer = document.getElementById("pc");
const monitorContainer = document.getElementById("monitor");
const CANTIDAD_PRODUCTOS = 3;
let ultimoId = 0;
let paginaActual = 1;


// Obtener el carrito desde localStorage
function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Guardar el carrito en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Crear una tarjeta de producto
function crearTarjeta(producto, tipoProducto) {
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
  price.textContent = `$ ${producto.precio}`;

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
      carrito.push({ ...producto, cantidad: 1, tipo_producto: tipoProducto });
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


async function getProductos(id, cantidad, url, tipoProducto) {
  const productos = [];
  let i = id + 1;

  while (productos.length < cantidad){
    const promise = await fetch(`${url}/${i}`);
    const items = await promise.json();
    items.forEach(e =>{
      const card = crearTarjeta(e, tipoProducto);
      pcContainer.appendChild(card);
    })
  }
}

async function paginaAnterior() {
    lastId -= 6;
    
    if (paginaActual === 2) {
        anterior.disabled = true;
        lastId = 0;
    }
    
    productos = await cargarProductos(lastId, CANTIDAD_SERIES);
    paginaActual--;
}

async function paginaSiguiente() {
    lastId = series[series.length - 1].id;
    if (anterior.disabled) {
        anterior.disabled = false;
    }
    series = await renderSeries(lastId, CANTIDAD_SERIES);
    paginaActual++;
}




// Cargar productos al inicio desde JSON
async function cargarProductos(url, tipoProducto) {
    
  pcContainer.innerHTML = "";
  monitorContainer.innerHTML = "";
    try{
      /*const promise = await fetch('/computadoras');
      const computadoras = await promise.json();
      computadoras.forEach(producto =>{
             const card = crearTarjeta(producto, "computadora");
            pcContainer.appendChild(card);})*/

      getProductos(ultimoId,CANTIDAD_PRODUCTOS, '/computadoras',"computadora");
          
    } catch(error){
      console.error("Error al cargar el producto: ", error)
    }

    try{
      /*const promise = await fetch('/monitores');
      const monitores = await promise.json();
      monitores.forEach(producto =>{
            const card = crearTarjeta(producto, "monitor");
            monitorContainer.appendChild(card);
      })*/
      getProductos(ultimoId,CANTIDAD_PRODUCTOS, '/monitores',"monitor");
    
    } catch(error){
      console.error("Error al cargar el producto: ", error)
    }
}


function actualizarContadorCarrito() {
    const carrito = getCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
      if (contador) {
        contador.textContent = totalItems;
      }
  }

(async () => {
  //cargar productos monitores()
  //cargar productos computadoras()
  await cargarProductos();
  actualizarContadorCarrito();
})();

