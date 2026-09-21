const { OLLAMA_URL } = require('../config/conexion-ia')
const pool = require('../config/conexion-db')
const dbService = require('../services/db.service')
const iaService = require('../services/ia.service')

const MODELO_IA = 'qwen2.5-coder:14b'

async function precargarModelo(modelo) {
  try {
    console.log(`Precargando ${modelo}...`)
    const respuesta = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelo,
        prompt: 'responde ok',
        stream: false,
        keep_alive: -1,
        options: {
          num_predict: 1
        }
      })
    })
    if (!respuesta.ok) {
      const error = await respuesta.text()
      throw new Error(`Ollama respondió ${respuesta.status}: ${error}`)
    }
    await respuesta.json()
    console.log(`${modelo} listo en memoria`)
  } catch (err) {
    console.error(`Error precargando ${modelo}:`, err.message)
    throw err
  }
}
async function esperarBaseDeDatos() {
  const maxIntentos = 20
  const espera = 2000
  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      await pool.query('SELECT 1')
      console.log('PostgreSQL listo')
      return
    } catch (err) {
      console.log(`Esperando PostgreSQL... intento ${intento}/${maxIntentos}`)
      await new Promise(resolve => setTimeout(resolve, espera))
    }
  }
  throw new Error('PostgreSQL no estuvo disponible después de varios intentos')
}
async function calentarIA() {
  try {
    console.log('Iniciando calentamiento de IA...')
    const usuarioId = 1
    await esperarBaseDeDatos()
    const contexto = await dbService.obtenerContextoIA(usuarioId)
    const pregunta1 = '¿Cuánto gasté este mes?'
    console.log('Calentamiento consulta 1...')
    const sql1 = await iaService.generarSQL(pregunta1, usuarioId, contexto)
    console.log('SQL 1:', sql1)
    const resultado1 = await dbService.ejecutarSQL(sql1)
    console.log('Resultado 1:', resultado1)
    const pregunta2 = '¿cuantos movimientos realice en total?'
    console.log('Calentamiento consulta 2...')
    const sql2 = await iaService.generarSQL(pregunta2, usuarioId, contexto)
    console.log('SQL 2:', sql2)
    const resultado2 = await dbService.ejecutarSQL(sql2)
    console.log('Resultado 2:', resultado2)
    console.log('Cache de SQL preparado')
    console.log('Calentamiento terminado')
  } catch (err) {
    console.error('Error durante el calentamiento de IA:', err.message)
    throw err
  }
}
async function iniciarIA() {
  await precargarModelo(MODELO_IA)
  await calentarIA()
  console.log(`${MODELO_IA} preparado para recibir consultas`)
}
module.exports = { iniciarIA }