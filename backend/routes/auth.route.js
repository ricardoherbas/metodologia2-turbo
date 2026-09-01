const express=require('express')
const router=express.Router()
const authController=require('../controllers/auth.controller')
const {validateInputRegistro,validateInputLogin,verificarToken}=require('../middlewares/auth-validator')
router.post('/registrar',validateInputRegistro,authController.registrar)
router.post('/login',validateInputLogin,authController.login)
router.get('/perfil',verificarToken,authController.getPerfil)
module.exports=router