/*
Ejemplo Contenido Estatico
Requiere:
npm install express
*/
const express = require('express') 
const app = express()
const port = 3000

app.use(express.static('Estatico'));

app.use('/', express.static('Estatico/pagesUser'));

app.use('/admin', express.static('Estatico/pagesAdmin'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})