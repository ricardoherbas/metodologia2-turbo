const usuariosService=require('../services/usuarios.service')
const obtenerTodas=async(req,res)=>{
  try{
    const usuarios=await usuariosService.obtenerTodas()
    res.status(200).json({
      ok:true,
      usuarios
    })
  }catch(error){
    console.error('Error al obtener usuarios:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener los usuarios'
    })
  }
}
const obtenerPorId=async(req,res)=>{
  try{
    const {id}=req.params
    const usuario=await usuariosService.obtenerPorId(id)
    res.status(200).json({
      ok:true,
      usuario
    })
  }catch(error){
    console.error('Error al obtener usuario:',error)
    if(error.message==='Usuario no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener el usuario'
    })
  }
}
const crear=async(req,res)=>{
  try{
    const {nombre,email,password}=req.body
    const usuario=await usuariosService.crear(nombre,email,password)
    res.status(201).json({
      ok:true,
      mensaje:'Usuario creado correctamente',
      usuario
    })
  }catch(error){
    console.error('Error al crear usuario:',error)
    if(error.code==='23505'){
      return res.status(409).json({
        ok:false,
        mensaje:'El email ya está registrado'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al crear el usuario'
    })
  }
}
const actualizar=async(req,res)=>{
  try{
    const {id}=req.params
    const {nombre,email,password}=req.body
    const usuario=await usuariosService.actualizar(id,nombre,email,password)
    res.status(200).json({
      ok:true,
      mensaje:'Usuario actualizado correctamente',
      usuario
    })
  }catch(error){
    console.error('Error al actualizar usuario:',error)
    if(error.message==='Usuario no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    if(error.code==='23505'){
      return res.status(409).json({
        ok:false,
        mensaje:'El email ya está registrado'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al actualizar el usuario'
    })
  }
}
const eliminar=async(req,res)=>{
  try{
    const {id}=req.params
    const usuario=await usuariosService.eliminar(id)
    res.status(200).json({
      ok:true,
      mensaje:'Usuario eliminado correctamente',
      usuario
    })
  }catch(error){
    console.error('Error al eliminar usuario:',error)
    if(error.message==='Usuario no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al eliminar el usuario'
    })
  }
}
module.exports={obtenerTodas,obtenerPorId,crear,actualizar,eliminar}