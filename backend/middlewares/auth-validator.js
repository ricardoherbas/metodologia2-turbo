const validateInputRegistro = (req, res, next) => {
  const { nombre, email, password } = req.body
  const error = []

  if (!nombre) {
    error.push('El nombre es obligatorio.')
  } else if (typeof nombre !== 'string' || nombre.trim().length === 0) {
    error.push('El nombre debe ser un texto válido y no vacío.')
  } else if (nombre.length > 100) {
    error.push('El nombre no puede superar los 100 caracteres.')
  }

  if (!email) {
    error.push('El email es obligatorio.')
  } else if (typeof email !== 'string') {
    error.push('El email debe ser un texto válido.')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.push('El email no tiene un formato válido.')
  } else if (email.length > 150) {
    error.push('El email no puede superar los 150 caracteres.')
  }

  if (!password) {
    error.push('La contraseña es obligatoria.')
  } else if (typeof password !== 'string') {
    error.push('La contraseña debe ser un texto válido.')
  } else if (password.length < 6) {
    error.push('La contraseña debe tener al menos 6 caracteres.')
  } else if (password.length > 255) {
    error.push('La contraseña no puede superar los 255 caracteres.')
  }

  if (error.length > 0) {
    return res.status(400).json({ error })
  }

  req.body.nombre = nombre.trim()
  req.body.email = email.trim().toLowerCase()
  next()
}

const validateInputLogin = (req, res, next) => {
  const { email, password } = req.body
  const error = []

  if (!email) {
    error.push('El email es obligatorio.')
  } else if (typeof email !== 'string') {
    error.push('El email debe ser un texto válido.')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.push('El email no tiene un formato válido.')
  } else if (email.length > 150) {
    error.push('El email no puede superar los 150 caracteres.')
  }

  if (!password) {
    error.push('La contraseña es obligatoria.')
  } else if (typeof password !== 'string') {
    error.push('La contraseña debe ser un texto válido.')
  }

  if (error.length > 0) {
    return res.status(400).json({ error })
  }

  req.body.email = email.trim().toLowerCase()
  next()
}

module.exports = {
  validateInputRegistro,
  validateInputLogin
}
