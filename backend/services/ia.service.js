const { conexionIA, precargarModelo } = require('../config/conexion-ia')
const MODELO_IA = 'qwen2.5-coder:14b'

async function generarSQL(pregunta, usuarioId, contexto) {
  const contextoBD = JSON.stringify(contexto)
  const prompt = `Convierte la pregunta del usuario en UNA sola consulta SELECT válida para PostgreSQL.

Usuario actual: ${usuarioId}

Reglas obligatorias:
- Usa únicamente tablas,columnas y datos presentes en el contexto.
- Interpreta la intención de la pregunta antes de generar SQL.
- No inventes tablas,columnas,valores,categorías,descripciones ni metas.
- Respeta siempre la relación entre los datos.
- Los datos privados deben pertenecer al usuario ${usuarioId}.
- Movimientos: filtra siempre por usuario_id=${usuarioId}.
- Metas: filtra siempre por usuario_id=${usuarioId}.
- Aportes: verifica que la meta relacionada pertenezca al usuario ${usuarioId}.
- Nunca consultes ni muestres password_hash.
- Para texto usa ILIKE cuando la coincidencia no tenga que ser exacta.
- Para relaciones entre tablas usa JOIN cuando sea necesario.
- No agregues filtros de fecha si el usuario no los solicita.
- Usa CURRENT_DATE para preguntas relativas a fechas.
- "hoy" corresponde a CURRENT_DATE.
- "ayer" corresponde a CURRENT_DATE-INTERVAL '1 day'.
- "este mes" corresponde al mes actual.
- "este año" corresponde al año actual.
- Usa SUM,COUNT,AVG,MAX o MIN cuando la pregunta solicite cantidades,conteos,promedios,máximos o mínimos.
- Usa GROUP BY cuando sea necesario para comparar o agrupar resultados.
- Usa ORDER BY y LIMIT cuando la pregunta solicite el mayor,menor,primero,último,más avanzado o similar.
- Calcula porcentajes o diferencias solamente cuando puedan obtenerse de los datos disponibles.
- Si la pregunta solicita información que no existe en el contexto,no inventes datos.
- La consulta debe devolver información útil para responder directamente la pregunta.
- Devuelve SOLO SQL.
- No uses markdown.
- No expliques la consulta.

Contexto de la base de datos:
${contextoBD}

Pregunta:
${pregunta}`

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

  const prompt = `Responde directamente la pregunta del usuario en español.

Reglas obligatorias:
- Usa únicamente los datos obtenidos.
- No inventes información ni cantidades.
- Interpreta los datos antes de responder.
- Si los datos permiten calcular una diferencia,porcentaje,total o comparación,puedes hacerlo.
- Si los datos no permiten responder,no inventes una respuesta.
- Sé claro,natural y breve.
- No menciones SQL,PostgreSQL,base de datos,IA,prompt ni procesos internos.
- Máximo 3 oraciones.
- Sin markdown.
- No inventes plazos,fechas ni cantidades de meses.
- Si no existe fecha_limite ni el usuario indicó un plazo,no calcules un ahorro mensual exacto.
- Si falta el plazo,explica que se necesita conocer la fecha límite para calcular cuánto ahorrar por mes.
- Si existe monto_faltante,úsalo para explicar cuánto dinero falta.
- Si existe fecha_limite,puedes explicar el plan de ahorro usando solamente los datos disponibles.
- Responde solamente con la respuesta final.

Datos obtenidos:
${JSON.stringify(resultado)}

Pregunta:
${pregunta}`

  return await conexionIA(MODELO_IA, prompt)
}

async function iniciarIA() {
  await precargarModelo(MODELO_IA)
}

module.exports = {
  generarSQL,
  generarRespuesta,
  iniciarIA
}
