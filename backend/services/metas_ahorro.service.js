const pool=require('../config/conexion-db')
const obtenerTodas=async()=>{
  const resultado=await pool.query('SELECT id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en FROM metas_ahorro ORDER BY id DESC')
  return resultado.rows
}
const obtenerPorId=async(id)=>{
  const resultado=await pool.query('SELECT id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en FROM metas_ahorro WHERE id=$1',[id])
  if(resultado.rows.length===0){
    throw new Error('Meta no encontrada')
  }
  return resultado.rows[0]
}
const obtenerPorUsuario=async(usuario_id)=>{
  const resultado=await pool.query('SELECT id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en FROM metas_ahorro WHERE usuario_id=$1 ORDER BY id DESC',[usuario_id])
  return resultado.rows
}
const crear=async(usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite)=>{
  const resultado=await pool.query('INSERT INTO metas_ahorro(usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite) VALUES($1,$2,$3,COALESCE($4,0.00),COALESCE($5,\'en proceso\'),$6) RETURNING id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en',[usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite||null])
  return resultado.rows[0]
}
const actualizar=async(id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite)=>{
  const resultado=await pool.query('UPDATE metas_ahorro SET usuario_id=$1,nombre=$2,monto_objetivo=$3,monto_actual=$4,estado=$5,fecha_limite=$6 WHERE id=$7 RETURNING id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en',[usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite||null,id])
  if(resultado.rows.length===0){
    throw new Error('Meta no encontrada')
  }
  return resultado.rows[0]
}
const eliminar=async(id)=>{
  const resultado=await pool.query('DELETE FROM metas_ahorro WHERE id=$1 RETURNING id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en',[id])
  if(resultado.rows.length===0){
    throw new Error('Meta no encontrada')
  }
  return resultado.rows[0]
}
module.exports={obtenerTodas,obtenerPorId,obtenerPorUsuario,crear,actualizar,eliminar}