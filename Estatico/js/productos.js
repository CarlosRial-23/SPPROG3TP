const pcContainer = document.getElementById("pc");
const monitorContainer = document.getElementById("monitor");
const CANTIDAD_PRODUCTOS = 3;
const estadoPc ={
  ultimoId: 0 ,
  paginaActual : 1, 
}
let ultimoIdMonitor = 0;

const estadoMonitor ={
  ultimoId : 0,
  paginaActual : 1,

}

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


//getProductos me devuelve un array con la cantidad de productos a traer desde una URL determinada.
async function getProductos(id, cantidad, url) {
  let i = id + 1;
  let productos = [];

  while (productos.length < cantidad) {
    try {
      const promise = await fetch(`${url}/${i}`);
      if (promise.status === 200) {
        const data = await promise.json(); //transformo la data que me devuelve el json

        if (Array.isArray(data)) {
          data.forEach((element) => {
            productos.push(element);
          });
        } else {
          productos.push(data);
        }
        i++;
      } else {
        break;
      }
    } catch (error) {
      console.log(`Error al obtener el producto ${id}`, error);
      break;
    } 
  }
  return productos;
}

  async function paginaAnterior(estado, containerProducto, url, tipoProducto, anterior, siguiente) {
  //Cuando mi pagina actual es la primera, no tengo boton disabled.
  if (estado.paginaActual <= 1) {
    anterior.disabled = true;
    return;
  }

  //Estoy en la pagina 2 por ejemplo

  //Le resta 1 a mi pagina actual
  estado.paginaActual--;
  console.log(`Estoy en la pagina ${estado.paginaActual}`)

  estado.ultimoId = (estado.paginaActual - 1) * CANTIDAD_PRODUCTOS;

  let productos = await renderProductos(containerProducto, url, tipoProducto, estado.ultimoId);

  if (estado.paginaActual === 1) {
    anterior.disabled = true;  // Primera página: no puedo ir atrás
    siguiente.disabled = false;
  } else {
    anterior.disabled = false; // Más atrás habilitado
  }

  siguiente.disabled = false;

}

  async function paginaSiguiente(estado, containerProducto, url, tipoProducto, anterior, siguiente) {
  estado.paginaActual++;
  console.log(`Estoy en la pagina ${estado.paginaActual}`)

  let inicio = (estado.paginaActual - 1) * CANTIDAD_PRODUCTOS;
  estado.ultimoId = inicio;
  
  let productos = await renderProductos(containerProducto, url, tipoProducto, estado.ultimoId);

  if (productos.length === 0) {
    containerProducto.innerHTML = "<div>FINALIZO LA LISTA DE PRODUCTOS A MOSTRAR. REGRESE A LA PAGINA ANTERIOR</div>"
    siguiente.disabled = true;
  }

  anterior.disabled = false;
}

  // Cargar productos al inicio desde JSON
  async function renderProductos(containerProducto, url, tipoProducto, ultimoId) { //Cargar productos deberia cargar el array de los productos.
    let retorno = "";
    containerProducto.innerHTML = "";
    try {
      const arrayProducto = await getProductos(ultimoId, CANTIDAD_PRODUCTOS, url);
      const productosValidos = arrayProducto.filter(p => p != null);
      if (productosValidos.length === 0){
        retorno = [];
      }
      productosValidos.forEach(e =>{
        const card = crearTarjeta(e, tipoProducto);
        containerProducto.appendChild(card);
      });
      retorno = productosValidos;
    
    } catch (error) {
      console.error("Error al cargar el producto: ", error);
    }
    return retorno;
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
    
    /*Container de los productos
      const pcContainer = document.getElementById("pc");
      const monitorContainer = document.getElementById("monitor");*/

    //Primer renderizado. 
    await renderProductos(pcContainer,'/computadoras','computadora',estadoPc.ultimoId);
    await renderProductos(monitorContainer,'/monitores','monitor',estadoMonitor.ultimoId);

    const anteriorPc = document.getElementById('anteriorPc');
    const siguientePc = document.getElementById('siguientePc');
    const anteriorMonitor = document.getElementById('anteriorMonitor');
    const siguienteMonitor = document.getElementById('siguienteMonitor');

    anteriorPc.addEventListener('click', () => paginaAnterior(estadoPc,pcContainer,'/computadoras','computadora', anteriorPc, siguientePc));
    siguientePc.addEventListener('click', () => paginaSiguiente(estadoPc, pcContainer, '/computadoras', 'computadora', anteriorPc, siguientePc));

    anteriorMonitor.addEventListener('click', () => paginaAnterior(estadoMonitor,monitorContainer,'/monitores','monitor', anteriorMonitor, siguienteMonitor));
    siguienteMonitor.addEventListener('click', () => paginaSiguiente(estadoMonitor, monitorContainer, '/monitores', 'monitor', anteriorMonitor, siguienteMonitor));

   
    actualizarContadorCarrito();
  })();

