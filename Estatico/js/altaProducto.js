document.addEventListener('DOMContentLoaded', ()=>{
    const formulario = document.querySelector('form');

    formulario.addEventListener('submit', async(e)=>{
        e.preventDefault();
        const formData = new FormData(formulario);

        try{
            const res = await fetch('/admin/alta-producto',{
                method:'POST',
                body: formData
            });
            if(res.ok){ //me devolvio un status del 200-299
                alert('Producto Cargado Exitosamente');
                window.location.href = '/admin/dashboard';
            } else {
                alert('Hubo un problema al cargar el producto');
            }
                
        } catch(error){
            console.log({error: "Error"});
        }
    })
})