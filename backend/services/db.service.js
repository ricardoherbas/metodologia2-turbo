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
    const contexto={}
    const tablas=await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_type='BASE TABLE'
      ORDER BY table_name
    `)
    const columnas=await pool.query(`
      SELECT table_name,column_name,data_type
      FROM information_schema.columns
      WHERE table_schema='public'
      ORDER BY table_name,ordinal_position
    `)
    contexto.esquema={
      tablas:tablas.rows.map(t=>t.table_name),
      columnas:columnas.rows
    }
    const categorias=await pool.query(`
      SELECT id,nombre
      FROM categorias
      ORDER BY nombre
    `)
    contexto.categorias=categorias.rows
    const descripciones=await pool.query(`
      SELECT DISTINCT descripcion
      FROM movimientos
      WHERE usuario_id=$1
      AND descripcion IS NOT NULL
      AND TRIM(descripcion)<>''
      ORDER BY descripcion
    `,[usuarioId])
    contexto.descripciones_movimientos=descripciones.rows.map(r=>r.descripcion)
    const metas=await pool.query(`
      SELECT
        id,
        nombre,
        monto_objetivo,
        monto_actual,
        estado,
        fecha_limite,
        ROUND((monto_actual/NULLIF(monto_objetivo,0))*100,2) AS porcentaje
      FROM metas_ahorro
      WHERE usuario_id=$1
      ORDER BY nombre
    `,[usuarioId])
    contexto.metas=metas.rows
    const resumen=await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN tipo='ingreso' THEN monto ELSE 0 END),0) AS total_ingresos,
        COALESCE(SUM(CASE WHEN tipo='gasto' THEN monto ELSE 0 END),0) AS total_gastos,
        COALESCE(SUM(CASE WHEN tipo='ingreso' THEN monto ELSE -monto END),0) AS saldo
      FROM movimientos
      WHERE usuario_id=$1
    `,[usuarioId])
    contexto.resumen_financiero=resumen.rows[0]
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