function clickerBtnIngresar() {
  document.addEventListener("DOMContentLoaded", () => {
    const inicio = document.getElementById("inicio");
    inicio.addEventListener("submit", function (e) {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value.trim();
      const password = document.getElementById("password").value;
      if (nombre && password) {
        localStorage.setItem("nombreUsuario", nombre);
        window.location.href = "/admin/dashboard.html";
      } else {
        alert("Por favor completar todos los campos.")
      }
    });
  });
}


clickerBtnIngresar();