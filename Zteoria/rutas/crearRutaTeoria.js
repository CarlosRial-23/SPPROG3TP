const express = require('express');
const servidor = express();

/**/
const rutasLibros = servidor.route("/libros");

//Le paso todos los metodos. 
rutasLibros
.get((req,res) =>{ res.send('Get de libros')})
.post((req,res) => { res.send('Post de Libros')})
.put((req,res) =>{ res.send('Put de libros')})
.delete((req,res) =>{res.send('Detele de libros')})

servidor.listen(3001);