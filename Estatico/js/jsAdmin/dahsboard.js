document.addEventListener("DOMContentLoaded", ()=>{
    renderizarTabla("/admin/monitores","t_body_monitores");
    renderizarTabla("/admin/computadoras", "t_body_computadoras");
    actualizarToken();
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


async function actualizarToken() {
    const intervalo = 1000 * 60 * 14;
    //const intervalo = 1000 * 4;
    setTimeout(async()=>{
        try{
            const res = await fetch('/admin/refresh',{
              method: 'POST',
              headers:{
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
    
            if(!res.ok){
              const error = await res.text();
              throw new Error(error)}
    
            actualizarToken();
          }catch(error){
            console.log(`Error:`, error);
            alert("Error de login: " + error.message);
            window.location.href = "/admin";
          }
    },intervalo); 
}

document.getElementById('logoutBtn').addEventListener("click", async ()=>{
    try{
        const res = await fetch('/admin/logout',{
            method: 'POST',
            credentials: 'include',
        })
     
    if(!res.ok) throw new Error("Error al cerrar sesion");
    window.location.href = "/admin";
    } catch(error){
         console.error("Error cerrando sesión:", err);
        alert("No se pudo cerrar sesión.");
    }
});