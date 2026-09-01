const pool=require('../config/conexion-db')
const obtenerTodas=async()=>{
  const resultado=await pool.query('SELECT id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en FROM movimientos ORDER BY fecha DESC,id DESC')
  return resultado.rows
}
const obtenerPorId=async(id)=>{
  const resultado=await pool.query('SELECT id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en FROM movimientos WHERE id=$1',[id])
  if(resultado.rows.length===0){
    throw new Error('Movimiento no encontrado')
  }
  return resultado.rows[0]
}
const obtenerPorUsuario=async(usuario_id)=>{
  const resultado=await pool.query('SELECT id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en FROM movimientos WHERE usuario_id=$1 ORDER BY fecha DESC,id DESC',[usuario_id])
  return resultado.rows
}
const obtenerPorCategoria=async(categoria_id)=>{
  const resultado=await pool.query('SELECT id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en FROM movimientos WHERE categoria_id=$1 ORDER BY fecha DESC,id DESC',[categoria_id])
  return resultado.rows
}
const crear=async(usuario_id,categoria_id,tipo,monto,descripcion,fecha)=>{
  const resultado=await pool.query('INSERT INTO movimientos(usuario_id,categoria_id,tipo,monto,descripcion,fecha) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[usuario_id,categoria_id,tipo,monto,descripcion||null,fecha])
  return resultado.rows[0]
}
const actualizar=async(id,usuario_id,categoria_id,tipo,monto,descripcion,fecha)=>{
  const resultado=await pool.query('UPDATE movimientos SET usuario_id=$1,categoria_id=$2,tipo=$3,monto=$4,descripcion=$5,fecha=$6 WHERE id=$7 RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[usuario_id,categoria_id,tipo,monto,descripcion||null,fecha,id])
  if(resultado.rows.length===0){
    throw new Error('Movimiento no encontrado')
  }
  return resultado.rows[0]
}
const eliminar=async(id)=>{
  const resultado=await pool.query('DELETE FROM movimientos WHERE id=$1 RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[id])
  if(resultado.rows.length===0){
    throw new Error('Movimiento no encontrado')
  }
  return resultado.rows[0]
}
module.exports={obtenerTodas,obtenerPorId,obtenerPorUsuario,obtenerPorCategoria,crear,actualizar,eliminar}