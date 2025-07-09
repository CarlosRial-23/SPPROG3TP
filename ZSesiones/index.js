const cookieParser = require('cookie-parser');
const express = require('express');
const app = express() //lo hago en una nueva app pero lo voy a terminar pasando al otro index y haciendo la routes. 

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs') //evaluar este tema


