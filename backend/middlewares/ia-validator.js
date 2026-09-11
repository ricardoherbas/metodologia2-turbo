function consultaValidator(req, res, next) {
  const { pregunta } = req.body

  if (!pregunta) {
    return res.status(400).json({ error: 'La pregunta es obligatoria' })
  }

  if (pregunta.trim().length < 6) {
    return res.status(400).json({ error: 'La pregunta debe tener al menos 6 caracteres' })
  }

  next()
}

module.exports = { consultaValidator }
