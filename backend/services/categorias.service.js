const pool=require('../config/conexion-db')
const obtenerTodas=async()=>{
  const resultado=await pool.query(
    'SELECT id,nombre FROM categorias ORDER BY nombre ASC'
  )
  return resultado.rows
}
const obtenerPorId=async(id)=>{
  const resultado=await pool.query(
    'SELECT id,nombre FROM categorias WHERE id=$1',
    [id]
  )
  if(resultado.rows.length===0){
    throw new Error('Categoría no encontrada')
  }
  return resultado.rows[0]
}
const crear=async(nombre)=>{
  const resultado=await pool.query(
    'INSERT INTO categorias(nombre) VALUES($1) RETURNING id,nombre',
    [nombre]
  )
  return resultado.rows[0]
}
const actualizar=async(id,nombre)=>{
  const resultado=await pool.query(
    'UPDATE categorias SET nombre=$1 WHERE id=$2 RETURNING id,nombre',
    [nombre,id]
  )
  if(resultado.rows.length===0){
    throw new Error('Categoría no encontrada')
  }
  return resultado.rows[0]
}
const eliminar=async(id)=>{
  const resultado=await pool.query(
    'DELETE FROM categorias WHERE id=$1 RETURNING id,nombre',
    [id]
  )
  if(resultado.rows.length===0){
    throw new Error('Categoría no encontrada')
  }
  return resultado.rows[0]
}
module.exports={obtenerTodas,obtenerPorId,crear,actualizar,eliminar}