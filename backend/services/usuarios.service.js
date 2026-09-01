const pool=require('../config/conexion-db')
const bcrypt=require('bcrypt')
const obtenerTodas=async()=>{
  const resultado=await pool.query('SELECT id,nombre,email,creado_en FROM usuarios ORDER BY id DESC')
  return resultado.rows
}
const obtenerPorId=async(id)=>{
  const resultado=await pool.query('SELECT id,nombre,email,creado_en FROM usuarios WHERE id=$1',[id])
  if(resultado.rows.length===0){
    throw new Error('Usuario no encontrado')
  }
  return resultado.rows[0]
}
const obtenerPorEmail=async(email)=>{
  const resultado=await pool.query('SELECT id,nombre,email,password_hash,creado_en FROM usuarios WHERE email=$1',[email])
  if(resultado.rows.length===0){
    throw new Error('Usuario no encontrado')
  }
  return resultado.rows[0]
}
const crear=async(nombre,email,password)=>{
  const passwordHash=await bcrypt.hash(password,10)
  const resultado=await pool.query('INSERT INTO usuarios(nombre,email,password_hash) VALUES($1,$2,$3) RETURNING id,nombre,email,creado_en',[nombre,email,passwordHash])
  return resultado.rows[0]
}
const actualizar=async(id,nombre,email,password)=>{
  let resultado
  if(password!==undefined){
    const passwordHash=await bcrypt.hash(password,10)
    resultado=await pool.query('UPDATE usuarios SET nombre=$1,email=$2,password_hash=$3 WHERE id=$4 RETURNING id,nombre,email,creado_en',[nombre,email,passwordHash,id])
  }else{
    resultado=await pool.query('UPDATE usuarios SET nombre=$1,email=$2 WHERE id=$3 RETURNING id,nombre,email,creado_en',[nombre,email,id])
  }
  if(resultado.rows.length===0){
    throw new Error('Usuario no encontrado')
  }
  return resultado.rows[0]
}
const eliminar=async(id)=>{
  const resultado=await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING id,nombre,email,creado_en',[id])
  if(resultado.rows.length===0){
    throw new Error('Usuario no encontrado')
  }
  return resultado.rows[0]
}
module.exports={obtenerTodas,obtenerPorId,obtenerPorEmail,crear,actualizar,eliminar}