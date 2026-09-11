const jwt = require('jsonwebtoken')

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET || "clave_secreta",
    { expiresIn: '24h' }
  )
}

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Token requerido' })
    }

    const partes = authHeader.split(' ')
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido' })
    }

    const token = partes[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.usuario = { id: decoded.id, email: decoded.email }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' })
    }
    return res.status(401).json({ error: 'No autorizado' })
  }
}

module.exports = {
  generarToken,
  verificarToken
}
