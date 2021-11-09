const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = require('./routes/router');

const app = express();

//Seteamos el motor de plantillas
app.set('view engine','ejs');

//Unimos directorios de los archivos estaticos
app.use(express.static(path.join(__dirname,'public')));


//Para procesar datos enviados desde formularios 
app.use(express.urlencoded({extended:true}));
app.use(express.json());




dotenv.config({path:'.env/.env'});

//Para trabajar con las cookies
app.use(cookieParser());

//Middleware para utilziar las rutas
app.use('/',router);


//Para eliminar cache y no volver hacia atras
app.use(function(req,res,next){
    if(!req.user){
        res.header('Cache-Control','private,no-cache,no-store,must-revalidate');
    }
});

app.listen(3000,(err)=>{
    if(err){
        throw err;
    }else{
        console.log('Server running on http://localhost:3000');
    }
});