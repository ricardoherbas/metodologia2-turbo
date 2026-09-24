const validarCategoria = (req, res, next) => {
  const { nombre } = req.body;
  const errors = [];

  if (nombre === undefined) {
    errors.push("El nombre de la categoría es obligatorio");
  } else if (typeof nombre !== "string") {
    errors.push("El nombre de la categoría debe ser texto");
  } else {
    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length === 0) {
      errors.push("El nombre de la categoría no puede estar vacío");
    }
    if (nombreLimpio.length > 50) {
      errors.push("El nombre de la categoría no puede superar los 50 caracteres");
    }
    if (errors.length === 0) {
      req.body.nombre = nombreLimpio;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validarCategoria };
