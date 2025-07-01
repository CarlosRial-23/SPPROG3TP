document.addEventListener("DOMContentLoaded", ()=>{
    renderizarTabla("/admin/monitores","t_body_monitores")
    renderizarTabla("/admin/computadoras", "t_body_computadoras")
})

async function renderizarTabla(url, tableBody) {
    try{
        const res = await fetch(url);
        const productos = await res.json();

        const tbody = document.getElementById(tableBody);
        tbody.innerHTML="";

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
            ✏️ Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="toggleActivo(${e.id}, ${e.activo}, '${url}')">
                ${e.activo ? '🛑 Desactivar' : '✅ Activar'}
                </button>
        </td>
            `;
            tbody.appendChild(tr);
        });
    } catch(error){
        console.log("Error al cargar el producto", error);
    }
    
}