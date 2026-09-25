const { conexionIA} = require('../config/conexion-ia')
const MODELO_IA = 'qwen2.5-coder:14b'

async function generarSQL(pregunta, usuarioId, contexto) {
  const contextoBD = JSON.stringify(contexto)
  const prompt = `SQL=SELECT;USUARIO=${usuarioId};REGLAS=TABLAS:solo_contexto|COLUMNAS:solo_contexto|DATOS:solo_contexto|PRIVADOS:usuario_id:${usuarioId}|MOVIMIENTOS:usuario_id:${usuarioId}|METAS:usuario_id:${usuarioId}|APORTES:meta->usuario:${usuarioId}|PASSWORD_HASH:NO|TEXTO:ILIKE|JOIN:solo_necesario|FECHAS:solo_si_se_piden|HOY:CURRENT_DATE|AYER:CURRENT_DATE-INTERVAL '1 day'|MES:mes_actual|AÑO:año_actual|AGREGACIONES:SUM,COUNT,AVG,MAX,MIN|GROUP_BY:si_se_necesario|ORDER_LIMIT:si_se_pide|CALCULOS:solo_con_datos_disponibles|INVENTAR:NO|SALIDA:SOLO_SQL;CONTEXTO:${contextoBD};PREGUNTA:${pregunta}`
  let sql = await conexionIA(MODELO_IA, prompt)
  sql = sql.replace(/```sql|```/gi, '').trim()
  const match = sql.match(/(SELECT|WITH)[\s\S]*/i)
  sql = match ? match[0].trim() : sql.trim()
  sql = sql.replace(/;[\s\S]*$/, ';')
  if (!sql.toUpperCase().startsWith('SELECT') && !sql.toUpperCase().startsWith('WITH')) {
    throw new Error('La IA no devolvió una consulta SQL válida')
  }
  return sql
}

async function generarRespuesta(pregunta, resultado) {
  if (!resultado || resultado.length === 0) {
    return 'No encontré datos relacionados con tu consulta.'
  }
  const prompt = `RESPUESTA=ESPAÑOL;REGLAS=DATOS:solo_resultado|SI_DATOS_PRESENTES=RESPONDER_CON_ESOS_DATOS|CALCULOS:solo_si_los_datos_lo_permiten|INVENTAR:NO|FECHAS:solo_si_existen_en_datos|MONTOS:solo_si_existen_en_datos|TRATO:vos|BREVE:SI|MAX_ORACIONES:3|SALIDA:SOLO_RESPUESTA;DATOS:${JSON.stringify(resultado)};PREGUNTA:${pregunta}`;
  return await conexionIA(MODELO_IA, prompt)
}

module.exports = { generarSQL, generarRespuesta}
