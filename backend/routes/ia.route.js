const express = require('express')
const router = express.Router()
const iaController = require('../controllers/ia.controller')
const { consultaValidator } = require('../middlewares/ia-validator')
const { verificarToken } = require('../middlewares/auth.middleware')

router.post('/consultar', verificarToken, consultaValidator, iaController.consultarIA)

module.exports = router
