const express = require('express');
const servidor = express();
const routerUser = require("./routerTeoria");

//Asi se usa el servidor. 
servidor.use('/usuarios', routerUser);

servidor.listen(3002, ()=>{console.log("Levanto el servidor")})


//QUERY PARAMS -> libros?autor=pepeito&titulo=loQueSea
    //tomar dentro del servidor los queryparams: const queryParams = req.query //Es el objeto de la JSON. 