function cargarTema() {
    const root = document.documentElement;
    const tema = JSON.parse(localStorage.getItem('tema'));
    const iconoTema = document.getElementById('icono-tema');

    if (tema === 'oscuro') {
        iconoTema.classList.replace('bi-brightness-high-fill', 'bi-moon-fill');
        root.style.setProperty('--color-principal', '#070707');
        root.style.setProperty('--color-secundario', '#0f0f0f');
        root.style.setProperty('--color-secundario-claro', '#181818');
        root.style.setProperty('--color-texto', '#F2F2F2');

    }else{
        iconoTema.classList.replace('bi-moon-fill', 'bi-brightness-high-fill');
        root.style.setProperty('--color-principal', '#ffffff');
        root.style.setProperty('--color-secundario', '#adadad');
        root.style.setProperty('--color-secundario-claro', '#c5c5c5');
        root.style.setProperty('--color-texto', '#000000');
    }

    return tema
}

function cambiarTema() {
  const temaActual = JSON.parse(localStorage.getItem('tema')) || 'oscuro';
  const nuevoTema = temaActual === 'oscuro' ? 'claro' : 'oscuro';
  localStorage.setItem('tema', JSON.stringify(nuevoTema));
  cargarTema();
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTema(); // Aplicar tema al cargar
  const botonTema = document.getElementById("boton-tema");
  botonTema?.addEventListener("click", cambiarTema);
});