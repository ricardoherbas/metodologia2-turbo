const categoriasService=require('../services/categorias.service')

const obtenerTodas=async(req,res)=>{
  try{
    const categorias=await categoriasService.obtenerTodas()
    res.status(200).json({
      ok:true,
      categorias
    })
  }catch(error){
    console.error('Error al obtener categorías:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener las categorías'
    })
  }
}
const obtenerPorId=async(req,res)=>{
  try{
    const {id}=req.params
    const categoria=await categoriasService.obtenerPorId(id)
    res.status(200).json({
      ok:true,
      categoria
    })
  }catch(error){
    console.error('Error al obtener categoría:',error)
    if(error.message==='Categoría no encontrada'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener la categoría'
    })
  }
}
const crear=async(req,res)=>{
  try{
    const {nombre}=req.body
    const categoria=await categoriasService.crear(nombre)
    res.status(201).json({
      ok:true,
      mensaje:'Categoría creada correctamente',
      categoria
    })
  }catch(error){
    console.error('Error al crear categoría:',error)
    if(error.code==='23505'){
      return res.status(409).json({
        ok:false,
        mensaje:'La categoría ya existe'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al crear la categoría'
    })
  }
}
const actualizar=async(req,res)=>{
  try{
    const {id}=req.params
    const {nombre}=req.body
    const categoria=await categoriasService.actualizar(id,nombre)
    res.status(200).json({
      ok:true,
      mensaje:'Categoría actualizada correctamente',
      categoria
    })
  }catch(error){
    console.error('Error al actualizar categoría:',error)
    if(error.message==='Categoría no encontrada'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    if(error.code==='23505'){
      return res.status(409).json({
        ok:false,
        mensaje:'La categoría ya existe'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al actualizar la categoría'
    })
  }
}
const eliminar=async(req,res)=>{
  try{
    const {id}=req.params
    const categoria=await categoriasService.eliminar(id)
    res.status(200).json({
      ok:true,
      mensaje:'Categoría eliminada correctamente',
      categoria
    })
  }catch(error){
    console.error('Error al eliminar categoría:',error)
    if(error.message==='Categoría no encontrada'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    if(error.code==='23503'){
      return res.status(409).json({
        ok:false,
        mensaje:'No se puede eliminar la categoría porque tiene movimientos asociados'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al eliminar la categoría'
    })
  }
}
module.exports={ obtenerTodas, obtenerPorId, crear, actualizar, eliminar}
