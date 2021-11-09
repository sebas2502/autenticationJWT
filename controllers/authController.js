const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const {promisify} = require('util');

//Procedimiento para registrar usuarios 
exports.register = async(req,res)=>{
    
    try {      //Si no encerramos esto dentro del try catch, dará error al hacer el insert a la base de datos
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

    //Encriptamos la pass
    let passHash = await bcryptjs.hash(password,8);

      conexion.query('INSERT INTO users set ?',{username:username,email:email,password:passHash},(err,reult)=>{
          if(err){
              throw err;
          }else{
              res.redirect('/');
          }
      });  
} catch (error) {
        throw error;
    }
    
    
    

    
}

exports.login = async(req,res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;

        if(!username || !password){
           res.render('login',{
               alert:true,
               alertTitle:"advertencia",
               alertMessagge:"Ingrese un usuario y/o contraseña",
               alertIcon:"info",
               showConfirmButton:true,
               timer:false,
               ruta:"login"
           });     
        }else{
            conexion.query('SELECT * FROM users WHERE username = ?',[username],async(err,results)=>{
                if(results.length == 0 || !(await bcryptjs.compare(password,results[0].password))){
                    res.render('login',{
                         alert:true,
                         alertTitle:"advertencia",
                         alertMessagge:"Ingrese un usuario y/o contraseña",
                         alertIcon:"info",
                         showConfirmButton:true,
                         timer:4000,
                         ruta:"login",
                         
                    });
                }else{

                    const id = results[0].id;
                    const token = jwt.sign({id:id},process.env.JWT_SECRETO,{
                        expiresIn:process.env.JWT_TIEMPO_EXPIRA
                    });

                    

                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt',token,cookiesOptions)
                    res.render('login',{
                        alert:true,
                        alertTitle:"¡Conexion Exitosa!",
                        alertMessagge:"¡Login Correcto!",
                        alertIcon:"success",
                        showConfirmButton:false,
                        timer:800,
                        ruta:"",
                        
                    });
                }
            });
        }    


    } catch (error) {
        throw error;
    }
}

exports.isAuthenticated = async(req,res,next)=>{
    if(req.cookies.jwt){
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM users WHERE id=?',[decodificada.id],(err,results)=>{
                if(!results){
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    }else{
        res.redirect('/login');
    }
}

exports.logOut = (req,res)=>{
    res.clearCookie('jwt');
    return res.redirect('/');
}