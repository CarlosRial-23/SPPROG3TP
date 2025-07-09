const express = require('express');
const routerUsuario = express.Router(); //creo un Router con el metodo de express.

//se comporta exactamente igual que el servidor -> Tiene all, get, post, put, delete, etc. 
routerUsuario.get('/', (req,res)=>{res.send("GET USUARIO")});
routerUsuario.get('/:id', (req,res)=>{res.send(`GET USUARIO por id: ${req.params.id}`)});
routerUsuario.put('/', (req,res)=>{res.send("PUT USUARIOS")});

module.exports = routerUsuario;

/**/ 