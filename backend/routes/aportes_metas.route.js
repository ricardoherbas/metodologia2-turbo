const express = require('express')
const router = express.Router()
const aportesMetasController = require('../controllers/aportes_metas.controller')
const { validateInputAporteMeta } = require('../middlewares/aportes_metas-validator')
const { verificarToken } = require('../middlewares/auth.middleware')

router.get('/', verificarToken, aportesMetasController.obtenerTodas)
router.get('/meta/:meta_id', verificarToken, aportesMetasController.obtenerPorMeta)
router.get('/:id', verificarToken, aportesMetasController.obtenerPorId)
router.post('/', verificarToken, validateInputAporteMeta, aportesMetasController.crear)
router.put('/:id', verificarToken, validateInputAporteMeta, aportesMetasController.actualizar)
router.delete('/:id', verificarToken, aportesMetasController.eliminar)

module.exports = router
