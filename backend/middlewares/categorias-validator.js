const validarCategoria = (req, res, next) => {
    const { nombre } = req.body;
    if (nombre === undefined) {
        return res.status(400).json({
            ok: false,
            mensaje: "El nombre de la categoría es obligatorio"
        });
    }
    if (typeof nombre !== "string") {
        return res.status(400).json({
            ok: false,
            mensaje: "El nombre de la categoría debe ser texto"
        });
    }
    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length === 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "El nombre de la categoría no puede estar vacío"
        });
    }
    if (nombreLimpio.length > 50) {
        return res.status(400).json({
            ok: false,
            mensaje: "El nombre de la categoría no puede superar los 50 caracteres"
        });
    }
    req.body.nombre = nombreLimpio;
    next();
};
module.exports = { validarCategoria};