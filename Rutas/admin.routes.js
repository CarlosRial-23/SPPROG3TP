require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { UserRepository } = require('../Estatico/js/jsAdmin/user-repository.js');
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY
const routerAdmin = express.Router();

routerAdmin.use(cookieParser());

//routerAdmin.set('view engine', 'ejs') //No se usa set con routerAdmin. 

//middleware para que haga añada el token a la info de la peticion. 
routerAdmin.use((req, res, next)=>{
    const token = req.cookies.access_token;
    req.user = null;

    try{
        const data = jwt.verify(token, SECRET_JWT_KEY);
        req.user = data;        
    } catch {
        req.user = null;
    }
    next();
})

//En el get de la raiz tengo que tener el user del req.session
routerAdmin.get('/user', (req,res)=>{
    if(!req.user){
        return res.status(401).json({error: "No autenticado"});
    }
    res.json({id: req.user.id, email: req.user.email});
})

//Log in de nuevo usuario
routerAdmin.post('/login', async (req,res)=>{
    const {email, password} = req.body; //lo pido del body.
    
    try{
        const usuarioRegistrado = await UserRepository.login({email,password});
        
        const token = jwt.sign(
            {id: usuarioRegistrado.id, email: usuarioRegistrado.email},
            SECRET_JWT_KEY,
            {expiresIn: '15m'})
        
            /* const refreshToken = jwt.sign(
            {id: user.id, username: user.username}, 
            SECRET_JWT_KEY,
            {expiresIn: '7d'}
            );*/

        res.cookie('access_token', token,
            {httpOnly: true,
             secure: false, //no estoy en https ahora
             sameSite: 'strict',
             maxAge: 1000 * 60* 10} //dura 10 minutos
        )
        .send(usuarioRegistrado);
    
    }catch(error){
        res.status(401).send(error.message);
    }
    }
)

//Registro
routerAdmin.post('/register', async (req,res)=> {
    const {email, name, password } = req.body;
    const rol = 'admin';

    try{
        const nuevoAdmin = await UserRepository.create({
            email,
            name,
            password,
            rol
        })

        res.status(201).json({message: 'Administrador Creado Exitosamente', Administrador:{
            id: nuevoAdmin.id, //Viene de la BD el id
            email: nuevoAdmin.email,
            name: nuevoAdmin.name,
            rol: rol,
        }})

    }catch(error){
        res.status(400).json({error: error.message});
    }
    
})

module.exports = routerAdmin;