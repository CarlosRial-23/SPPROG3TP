require("dotenv").config(); //npm i dotenv -> los instalo a través del paquete. 
const express = require("express");
const servidor =  express();
const {Sequelize} = require("sequelize");
const port = 3000;

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
    }
)
//Me traigo los productos de la BD, me los traigo con ORM o abriendo y cerrando una conexion a la BD.

//Test de coneccion
servidor.get("/test/conexion", async (req,res)=>{
    try{
        await sequelize.authenticate()
        res.status(200).send("Todo Ok")
    } catch(e){
        res.send(e)
    }
})


//Traerme todos los productos
servidor.get("/pcs", (req,res) => {
    
})

//Modificar producto
servidor.put("/pcs", (req,res) => {

})

//Crear producto
servidor.post("/pcs", (req,res) => {

})

//Borrar producto
servidor.delete("/pcs", (req,res) => {

})    

console.log("Variables de entorno:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
});

servidor.listen(port, ()=>{
    console.log(`App listenning on port ${port}`);
})
