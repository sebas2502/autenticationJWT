const express = require('express');
const router = express.Router();
const conexion = require('../database/db');
const authController = require('../controllers/authController');


router.get('/',authController.isAuthenticated,(req,res)=>{
    
    res.render('dashboard',{user:req.user});
}); 

router.get('/login',(req,res)=>{
    res.render('login',{alert:false});
}); 

router.get('/register',(req,res)=>{
    res.render('register');
}); 

router.post('/register',authController.register); 
router.post('/login',authController.login); 

router.get('/logout',authController.logOut);

router.get('/empleados',authController.isAuthenticated,(req,res)=>{
    res.render('empleados');
});

module.exports = router;