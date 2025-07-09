const port = 3000;
const app = require("./server.js");
const { sequelize } = require("./Modelo/dbSequelize.js");

sequelize
.sync() //Se sincronice la BD
.then(() => {
  //Que se ejecute mi servidor
  app.listen(port, () => {
    `Example app listenning on port ${port}`;
  })})
.catch((err)=>{
    console.log("Unable to connect to the database", err);
})
