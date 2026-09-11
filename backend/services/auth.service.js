const bcrypt = require('bcrypt')
const pool = require('../config/conexion-db')
const { generarToken } = require('../middleware/auth.middleware')

const login = async (email, password) => {
  const resultado = await pool.query(
    'SELECT id,nombre,email,password_hash FROM usuarios WHERE email=$1',
    [email]
  )
  if (resultado.rows.length === 0) throw new Error('Credenciales inválidas')

  const usuario = resultado.rows[0]
  const passwordValida = await bcrypt.compare(password, usuario.password_hash)
  if (!passwordValida) throw new Error('Credenciales inválidas')

  const token = generarToken(usuario)
  return {
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    token
  }
}

const registrar = async (nombre, email, password) => {
  const existe = await pool.query('SELECT id FROM usuarios WHERE email=$1', [email])
  if (existe.rows.length > 0) throw new Error('El email ya está registrado')

  const passwordHash = await bcrypt.hash(password, 10)
  const resultado = await pool.query(
    'INSERT INTO usuarios(nombre,email,password_hash) VALUES($1,$2,$3) RETURNING id,nombre,email,creado_en',
    [nombre, email, passwordHash]
  )

  const usuario = resultado.rows[0]
  const token = generarToken(usuario)
  return { usuario, token }
}

const obtenerPerfil = async (id) => {
  const resultado = await pool.query(
    'SELECT id,nombre,email,creado_en FROM usuarios WHERE id=$1',
    [id]
  )
  if (resultado.rows.length === 0) throw new Error('Usuario no encontrado')
  return resultado.rows[0]
}

module.exports = { login, registrar, obtenerPerfil }
