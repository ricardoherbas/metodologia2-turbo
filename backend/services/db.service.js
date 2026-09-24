const pool = require('../config/conexion-db')
async function ejecutarSQL(query, params = []) {
  try {
    const result = await pool.query(query, params)
    return result.rows
  } catch (err) {
    console.error('Error ejecutando SQL:', err)
    throw err
  }
}
async function obtenerContextoIA(usuarioId) {
  try {
    const tablas = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)
    const columnas = await pool.query(`
      SELECT
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND column_name <> 'password_hash'
      ORDER BY table_name, ordinal_position
    `)
    const columnasPorTabla = {}
    for (const columna of columnas.rows) {
      if (!columnasPorTabla[columna.table_name]) {
        columnasPorTabla[columna.table_name] = []
      }
      columnasPorTabla[columna.table_name].push(`${columna.column_name}:${columna.data_type}`)
    }
    const esquemaTexto = tablas.rows
      .map((tabla) => {
        const nombreTabla = tabla.table_name
        const columnasTabla = columnasPorTabla[nombreTabla] || []
        if (columnasTabla.length === 0) {
          return null
        }
        return `${nombreTabla}(${columnasTabla.join(',')})`
      })
      .filter(Boolean)
      .join(';')
    const categorias = await pool.query(`
      SELECT id, nombre
      FROM categorias
      ORDER BY id
    `)
    const categoriasTexto = categorias.rows
      .map(categoria => `${categoria.id}=${categoria.nombre}`)
      .join(',')
    const movimientos = await pool.query(`
      SELECT
        m.id,
        m.tipo,
        m.categoria_id,
        c.nombre AS categoria,
        m.monto,
        m.descripcion,
        m.fecha
      FROM movimientos m
      LEFT JOIN categorias c
        ON c.id = m.categoria_id
      WHERE m.usuario_id = $1
      ORDER BY m.fecha ASC, m.id ASC
    `, [usuarioId])
    const movimientosTexto = movimientos.rows
      .map(m => [
        m.id,
        m.tipo,
        m.categoria_id ?? '-',
        m.categoria || '-',
        m.monto,
        m.descripcion || '-',
        m.fecha || '-'
      ].join(','))
      .join(';')
    const descripciones = await pool.query(`
      SELECT DISTINCT descripcion
      FROM movimientos
      WHERE usuario_id = $1
      AND descripcion IS NOT NULL
      AND TRIM(descripcion) <> ''
      ORDER BY descripcion
    `, [usuarioId])
    const descripcionesTexto = descripciones.rows
      .map(fila => fila.descripcion)
      .join(',')
    const metas = await pool.query(`
      SELECT
        id,
        nombre,
        monto_objetivo,
        monto_actual,
        estado,
        fecha_limite,
        ROUND(
          (monto_actual / NULLIF(monto_objetivo, 0)) * 100,
          2
        ) AS porcentaje
      FROM metas_ahorro
      WHERE usuario_id = $1
      ORDER BY id
    `, [usuarioId])
    const metasTexto = metas.rows
      .map(meta => [
        meta.id,
        meta.nombre,
        meta.monto_objetivo,
        meta.monto_actual,
        meta.estado,
        meta.fecha_limite || '-',
        `${meta.porcentaje || 0}%`
      ].join(','))
      .join(';')
    const aportes = await pool.query(`
      SELECT
        a.id,
        a.meta_id,
        m.nombre AS meta,
        a.monto,
        a.fecha
      FROM aportes_metas a
      INNER JOIN metas_ahorro m
        ON m.id = a.meta_id
      WHERE m.usuario_id = $1
      ORDER BY a.fecha ASC, a.id ASC
    `, [usuarioId])
    const aportesTexto = aportes.rows
      .map(a => [
        a.id,
        a.meta_id,
        a.meta,
        a.monto,
        a.fecha || '-'
      ].join(','))
      .join(';')
    const resumen = await pool.query(`
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'ingreso' THEN monto
              ELSE 0
            END
          ),
          0
        ) AS ingresos,
        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'gasto' THEN monto
              ELSE 0
            END
          ),
          0
        ) AS gastos,
        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'ingreso' THEN monto
              ELSE -monto
            END
          ),
          0
        ) AS saldo
      FROM movimientos
      WHERE usuario_id = $1
    `, [usuarioId])
    const resumenFinanciero = resumen.rows[0]
    const contexto = `
U=${usuarioId}
T=${esquemaTexto}
R=movimientos.usuario_id>usuarios.id,movimientos.categoria_id>categorias.id,metas_ahorro.usuario_id>usuarios.id,aportes_metas.meta_id>metas_ahorro.id
C=${categoriasTexto || '-'}
M[id,tipo,cat_id,cat,monto,desc,fecha]=${movimientosTexto || '-'}
D=${descripcionesTexto || '-'}
G[id,nombre,obj,actual,estado,limite,%]=${metasTexto || '-'}
A[id,meta_id,meta,monto,fecha]=${aportesTexto || '-'}
S=ingresos:${resumenFinanciero.ingresos},gastos:${resumenFinanciero.gastos},saldo:${resumenFinanciero.saldo}
`.trim()
    console.log('Contexto IA generado')
    console.log(`Caracteres: ${contexto.length}`)
    console.log(`Tokens aproximados: ${Math.ceil(contexto.length / 4)}`)
    return contexto
  } catch (err) {
    console.error('Error obteniendo contexto de IA:', err)
    throw err
  }
}
module.exports = {
  ejecutarSQL,
  obtenerContextoIA
}
