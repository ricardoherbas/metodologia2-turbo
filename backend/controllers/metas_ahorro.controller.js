const metasAhorroService=require('../services/metas_ahorro.service')
const obtenerTodas=async(req,res)=>{
  try{
    const metas=await metasAhorroService.obtenerTodas()
    res.status(200).json({
      ok:true,
      metas
    })
  }catch(error){
    console.error('Error al obtener metas:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener las metas'
    })
  }
}
const obtenerPorId=async(req,res)=>{
  try{
    const {id}=req.params
    const meta=await metasAhorroService.obtenerPorId(id)
    res.status(200).json({
      ok:true,
      meta
    })
  }catch(error){
    console.error('Error al obtener meta:',error)
    if(error.message==='Meta no encontrada'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener la meta'
    })
  }
}
const obtenerPorUsuario=async(req,res)=>{
  try{
    const {usuario_id}=req.params
    const metas=await metasAhorroService.obtenerPorUsuario(usuario_id)
    res.status(200).json({
      ok:true,
      metas
    })
  }catch(error){
    console.error('Error al obtener metas del usuario:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener las metas del usuario'
    })
  }
}
const crear=async(req,res)=>{
  try{
    const {usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite}=req.body
    const meta=await metasAhorroService.crear(usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite)
    res.status(201).json({
      ok:true,
      mensaje:'Meta creada correctamente',
      meta
    })
  }catch(error){
    console.error('Error al crear meta:',error)
    if(error.code==='23503'){
      return res.status(404).json({
        ok:false,
        mensaje:'El usuario no existe'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al crear la meta'
    })
  }
}
const actualizar=async(req,res)=>{
  try{
    const {id}=req.params
    const {usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite}=req.body
    const meta=await metasAhorroService.actualizar(id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite)
    res.status(200).json({
      ok:true,
      mensaje:'Meta actualizada correctamente',
      meta
    })
  }catch(error){
    console.error('Error al actualizar meta:',error)
    if(error.message==='Meta no encontrada'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    if(error.code==='23503'){
      return res.status(404).json({
        ok:false,
        mensaje:'El usuario no existe'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al actualizar la meta'
    })
  }
}
const eliminar=async(req,res)=>{
  try{
    const {id}=req.params
    const meta=await metasAhorroService.eliminar(id)
    res.status(200).json({
      ok:true,
      mensaje:'Meta eliminada correctamente',
      meta
    })
  }catch(error){
    console.error('Error al eliminar meta:',error)
    if(error.message==='Meta no encontrada'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al eliminar la meta'
    })
  }
}
module.exports={obtenerTodas,obtenerPorId,obtenerPorUsuario,crear,actualizar,eliminar}