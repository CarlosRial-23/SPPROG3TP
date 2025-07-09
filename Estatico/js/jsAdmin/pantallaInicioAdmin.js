function clickerBtnIngresar() {
  document.addEventListener("DOMContentLoaded", () => {
    const inicio = document.getElementById("inicio"); //Es el form
    inicio.addEventListener("submit", async function (e) {
      e.preventDefault(); //Evita que la pagina se recargue (Comportamiento por defecto)
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      
      if(!email || !password){
        alert("Por favor completar todos los campos");
        return; //corto la ejecucion.
      }
      
      try{
        const res = await fetch('/admin/login',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({email, password}),
        });

        if(!res.ok){
          const error = await res.text();
          throw new Error(error)}

        const usuario = await res.json();
        console.log('Usuario autenticado:' , usuario.email);

        window.location.href = "/admin/dashboard";
      }catch(error){
        console.log(`Error:`, error);
        alert("Error de login: " + error.message)
      }


    });
  });
}


clickerBtnIngresar();