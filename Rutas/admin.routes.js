require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UserRepository = require('../Estatico/js/jsAdmin/user-repository.js');
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY
const routerAdmin = express.Router();
const path = require('path')

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

//Log in de nuevo usuario -->
routerAdmin.post('/login', async (req,res)=>{
    const {email, password} = req.body; //lo pido del body.
    
    try{
        const usuarioRegistrado = await UserRepository.login({email,password});
        
        const token = jwt.sign(
            {id: usuarioRegistrado.id, email: usuarioRegistrado.email},
            SECRET_JWT_KEY,
            {expiresIn: '15m'})
        
        const refreshToken = jwt.sign(
            {id: usuarioRegistrado.id, username: usuarioRegistrado.username}, 
            SECRET_JWT_KEY,
            {expiresIn: '7d'}
            );

        res
        .cookie('access_token', token,
            {httpOnly: true,
             secure: false, //no estoy en https ahora
             sameSite: 'strict',
             maxAge: 1000 * 60 * 15}
             //maxAge: 1000 * 60* 10} // 1000 milisegundos = 1 segundo, * 60 segundos = 1 minuto, * 10 = 10 minutos total
        )
        .cookie('refresh_token', refreshToken,
            {
                httpOnly: true,
                secure:false,
                sameSite: 'strict',
                maxAge: 1000 *60 *60 *24 * 7,
            }
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


routerAdmin.post('/refresh', async(req, res)=>{
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken){
        return res.status(401).json({error: 'No se encontre el refreshToken'});
    }

    try{
        const data = jwt.verify(refreshToken, SECRET_JWT_KEY);
        const tokenAccesoNuevo = jwt.sign(
            {id: data.id, email: data.email},
            SECRET_JWT_KEY,
            {expiresIn:'15m'}
        )
        //actualizo la cookie
        res.cookie('access_token', tokenAccesoNuevo,{
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 15
        })

        res.json({message: 'Token renovado'})

    } catch(error){
        res.status(403).json({error: 'Refresh token invalido.'})
    }
})


//Ruta protegida: si no tiene el usuario autenticado no puede entrar aca nadie.
routerAdmin.get('/dashboard', (req,res) =>{
    if(!req.user){
        return res.redirect('/admin')
    }

    res.sendFile(path.join(__dirname, '..','Admin', 'src','pagesAdmin', 'dashboard.html'))
})


routerAdmin.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, '..', 'Admin', 'src', 'pagesAdmin', 'index.html'));
});

//Desloggearse
routerAdmin.post('/logout', (req,res)=>{
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({message: 'Sesion finalizad'});
})

module.exports = routerAdmin;