const pool=require('../config/conexion-db')
async function ejecutarSQL(query,params=[]){
  try{
    const result=await pool.query(query,params)
    return result.rows
  }catch(err){
    console.error('Error ejecutando SQL:',err)
    throw err
  }
}
async function obtenerContextoIA(usuarioId){
  try{
    const tablas=await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_type='BASE TABLE'
      ORDER BY table_name
    `)
    const columnas=await pool.query(`
      SELECT
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_schema='public'
      AND column_name<>'password_hash'
      ORDER BY table_name,ordinal_position
    `)
    const columnasPorTabla={}
    for(const columna of columnas.rows){
      if(!columnasPorTabla[columna.table_name]){
        columnasPorTabla[columna.table_name]=[]
      }
      columnasPorTabla[columna.table_name].push(`${columna.column_name}:${columna.data_type}`)
    }
    const esquemaTexto=tablas.rows
      .map((tabla)=>{
        const nombreTabla=tabla.table_name
        const columnasTabla=columnasPorTabla[nombreTabla]||[]
        if(columnasTabla.length===0){
          return null
        }
        return `${nombreTabla}(${columnasTabla.join(',')})`
      })
      .filter(Boolean)
      .join('\n')
    const categorias=await pool.query(`
      SELECT
        id,
        nombre
      FROM categorias
      ORDER BY id
    `)
    const categoriasTexto=categorias.rows
      .map((categoria)=>{
        return `${categoria.id}=${categoria.nombre}`
      })
      .join(',')
    const movimientos=await pool.query(`
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
        ON c.id=m.categoria_id
      WHERE m.usuario_id=$1
      ORDER BY m.fecha ASC,m.id ASC
    `,[usuarioId])
    const movimientosTexto=movimientos.rows
      .map((movimiento)=>{
        const descripcion=movimiento.descripcion||'sin_descripcion'
        const categoria=movimiento.categoria||'sin_categoria'
        const fecha=movimiento.fecha||'sin_fecha'
        return [
          movimiento.id,
          movimiento.tipo,
          movimiento.categoria_id||'-',
          categoria,
          movimiento.monto,
          descripcion,
          fecha
        ].join('|')
      })
      .join('\n')
    const descripciones=await pool.query(`
      SELECT DISTINCT descripcion
      FROM movimientos
      WHERE usuario_id=$1
      AND descripcion IS NOT NULL
      AND TRIM(descripcion)<>''
      ORDER BY descripcion
    `,[usuarioId])
    const descripcionesTexto=descripciones.rows
      .map((fila)=>fila.descripcion)
      .join(',')
    const metas=await pool.query(`
      SELECT
        id,
        nombre,
        monto_objetivo,
        monto_actual,
        estado,
        fecha_limite,
        ROUND(
          (monto_actual/NULLIF(monto_objetivo,0))*100,
          2
        ) AS porcentaje
      FROM metas_ahorro
      WHERE usuario_id=$1
      ORDER BY id
    `,[usuarioId])
    const metasTexto=metas.rows
      .map((meta)=>{
        return [
          meta.id,
          meta.nombre,
          meta.monto_objetivo,
          meta.monto_actual,
          meta.estado,
          meta.fecha_limite||'sin_fecha',
          `${meta.porcentaje||0}%`
        ].join('|')
      })
      .join('\n')
    const aportes=await pool.query(`
      SELECT
        a.id,
        a.meta_id,
        m.nombre AS meta,
        a.monto,
        a.fecha
      FROM aportes_metas a
      INNER JOIN metas_ahorro m
        ON m.id=a.meta_id
      WHERE m.usuario_id=$1
      ORDER BY a.fecha ASC,a.id ASC
    `,[usuarioId])
    const aportesTexto=aportes.rows
      .map((aporte)=>{
        return [
          aporte.id,
          aporte.meta_id,
          aporte.meta,
          aporte.monto,
          aporte.fecha||'sin_fecha'
        ].join('|')
      })
      .join('\n')
    const resumen=await pool.query(`
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN tipo='ingreso'
              THEN monto
              ELSE 0
            END
          ),
          0
        ) AS total_ingresos,
        COALESCE(
          SUM(
            CASE
              WHEN tipo='gasto'
              THEN monto
              ELSE 0
            END
          ),
          0
        ) AS total_gastos,
        COALESCE(
          SUM(
            CASE
              WHEN tipo='ingreso'
              THEN monto
              ELSE -monto
            END
          ),
          0
        ) AS saldo
      FROM movimientos
      WHERE usuario_id=$1
    `,[usuarioId])
    const resumenFinanciero=resumen.rows[0]
    const contexto=`
USUARIO:${usuarioId}
SCHEMA:
${esquemaTexto}
RELACIONES:
movimientos.usuario_id -> usuarios.id
movimientos.categoria_id -> categorias.id
metas_ahorro.usuario_id -> usuarios.id
aportes_metas.meta_id -> metas_ahorro.id
CATEGORIAS:
${categoriasTexto||'ninguna'}
MOVIMIENTOS:
${movimientosTexto||'ninguno'}
DESCRIPCIONES:
${descripcionesTexto||'ninguna'}
METAS:
${metasTexto||'ninguna'}
APORTES_METAS:
${aportesTexto||'ninguno'}
RESUMEN:
ingresos=${resumenFinanciero.total_ingresos}
gastos=${resumenFinanciero.total_gastos}
saldo=${resumenFinanciero.saldo}
`.trim()
    console.log('📚 Contexto IA generado')
    console.log(`📏 Caracteres: ${contexto.length}`)
    console.log(`🪙 Tokens aproximados: ${Math.ceil(contexto.length/4)}`)
    return contexto
  }catch(err){
    console.error('Error obteniendo contexto de IA:',err)
    throw err
  }
}
module.exports={
  ejecutarSQL,
  obtenerContextoIA
}
