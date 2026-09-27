const bcrypt = require('bcrypt')
const crypto = require('crypto')
const pool = require('../config/conexion-db')
const { generarToken } = require('../middlewares/auth.middleware')
const { enviarEmail } = require('../utils/email.util')
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
  return { usuario }
}
const obtenerPerfil = async (id) => {
  const resultado = await pool.query(
    'SELECT id,nombre,email,creado_en FROM usuarios WHERE id=$1',
    [id]
  )
  if (resultado.rows.length === 0) throw new Error('Usuario no encontrado')
  return resultado.rows[0]
}
const recuperarPassword = async (email) => {
  const resultado = await pool.query(
    'SELECT id,email FROM usuarios WHERE email=$1',
    [email]
  )
  if (resultado.rows.length === 0) throw new Error('Usuario no encontrado')
  const usuario = resultado.rows[0]
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiraEn = new Date(Date.now() + 30 * 60 * 1000)
  await pool.query(
    'INSERT INTO recuperacion_password(usuario_id,token_hash,expira_en) VALUES($1,$2,$3)',
    [usuario.id, tokenHash, expiraEn]
  )
  const enlace = `${process.env.FRONTEND_URL}/restablecer-password.html?token=${token}`
  await enviarEmail(
    usuario.email,
    'Recuperación de contraseña',
    `
    <h2>Recuperación de contraseña</h2>
    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
    <p>Hacé clic en el siguiente enlace para crear una nueva contraseña:</p>
    <a href="${enlace}">Restablecer contraseña</a>
    <p>Este enlace será válido durante 30 minutos.</p>
    <p>Si no solicitaste este cambio, podés ignorar este correo.</p>
    `
  )
  return { mensaje: 'Se envió el correo de recuperación' }
}
const restablecerPassword = async (token, nuevaPassword) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const resultado = await pool.query(
    'SELECT id,usuario_id,expira_en,usado FROM recuperacion_password WHERE token_hash=$1',
    [tokenHash]
  )
  if (resultado.rows.length === 0) throw new Error('Token inválido')
  const recuperacion = resultado.rows[0]
  if (recuperacion.usado) throw new Error('El token ya fue utilizado')
  if (new Date() > new Date(recuperacion.expira_en)) throw new Error('El token ha expirado')
  const passwordHash = await bcrypt.hash(nuevaPassword, 10)
  await pool.query(
    'UPDATE usuarios SET password_hash=$1 WHERE id=$2',
    [passwordHash, recuperacion.usuario_id]
  )
  await pool.query(
    'UPDATE recuperacion_password SET usado=TRUE WHERE id=$1',
    [recuperacion.id]
  )
  return { mensaje: 'Contraseña restablecida correctamente' }
}
module.exports = { login, registrar, obtenerPerfil, recuperarPassword, restablecerPassword }