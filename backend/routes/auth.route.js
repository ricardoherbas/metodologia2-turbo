const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { validateInputRegistro, validateInputLogin } = require('../middlewares/auth-validator')
const { verificarToken } = require('../middlewares/auth.middleware')

router.post('/registrar', validateInputRegistro, authController.registrar)
router.post('/login', validateInputLogin, authController.login)
router.get('/perfil', verificarToken, authController.getPerfil)

module.exports = router
