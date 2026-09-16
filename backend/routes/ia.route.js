const express = require('express')
const router = express.Router()
const iaController = require('../controllers/ia.controller')
const { consultaValidator } = require('../middlewares/ia-validator')
const { verificarToken } = require('../middlewares/auth-validator')

router.post('/consultar', consultaValidator, iaController.consultarIA)
//, verificarToken
module.exports = router
