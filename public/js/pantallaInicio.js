document.addEventListener('DOMContentLoaded', () => {
  const inicio = document.getElementById('inicio');
  inicio.addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    if (nombre) {
      localStorage.setItem('nombreUsuario', nombre);
      window.location.href = '/productos';
    }
  });
});