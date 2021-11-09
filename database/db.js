const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({path:'./env/.env'});

const conexion = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

conexion.connect((err)=>{
    if(err){
        throw err;
    }else{
        console.log('Conectado a la base de datos...');
    }
});

module.exports = conexion;