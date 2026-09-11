const express = require('express')
const router = express.Router()
const metasAhorroController = require('../controllers/metas_ahorro.controller')
const { validateInputMetaAhorro } = require('../middlewares/metas_ahorro-validator')
const { verificarToken } = require('../middlewares/auth.middleware')

router.get('/', verificarToken, metasAhorroController.obtenerTodas)
router.get('/usuario/:usuario_id', verificarToken, metasAhorroController.obtenerPorUsuario)
router.get('/:id', verificarToken, metasAhorroController.obtenerPorId)
router.post('/', verificarToken, validateInputMetaAhorro, metasAhorroController.crear)
router.put('/:id', verificarToken, validateInputMetaAhorro, metasAhorroController.actualizar)
router.delete('/:id', verificarToken, metasAhorroController.eliminar)

module.exports = router
