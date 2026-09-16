const pool=require('../config/conexion-db')
const obtenerTodas=async()=>{
  const resultado=await pool.query('SELECT id,meta_id,monto,fecha,descripcion,creado_en FROM aportes_metas ORDER BY fecha DESC,id DESC')
  return resultado.rows
}
const obtenerPorId=async(id)=>{
  const resultado=await pool.query('SELECT id,meta_id,monto,fecha,descripcion,creado_en FROM aportes_metas WHERE id=$1',[id])
  if(resultado.rows.length===0){
    throw new Error('Aporte no encontrado')
  }
  return resultado.rows[0]
}
const obtenerPorMeta=async(meta_id)=>{
  const resultado=await pool.query('SELECT id,meta_id,monto,fecha,descripcion,creado_en FROM aportes_metas WHERE meta_id=$1 ORDER BY fecha DESC,id DESC',[meta_id])
  return resultado.rows
}
const crear=async(meta_id,monto,descripcion)=>{
  const resultado=await pool.query('INSERT INTO aportes_metas(meta_id,monto,descripcion) VALUES($1,$2,$3) RETURNING id,meta_id,monto,fecha,descripcion,creado_en',[meta_id,monto,descripcion||null])
  return resultado.rows[0]
}
const actualizar=async(id,meta_id,monto,descripcion)=>{
  const resultado=await pool.query('UPDATE aportes_metas SET meta_id=$1,monto=$2,descripcion=$3 WHERE id=$4 RETURNING id,meta_id,monto,fecha,descripcion,creado_en',[meta_id,monto,descripcion||null,id])
  if(resultado.rows.length===0){
    throw new Error('Aporte no encontrado')
  }
  return resultado.rows[0]
}
const eliminar=async(id)=>{
  const resultado=await pool.query('DELETE FROM aportes_metas WHERE id=$1 RETURNING id,meta_id,monto,fecha,descripcion,creado_en',[id])
  if(resultado.rows.length===0){
    throw new Error('Aporte no encontrado')
  }
  return resultado.rows[0]
}
module.exports={obtenerTodas,obtenerPorId,obtenerPorMeta,crear,actualizar,eliminar}