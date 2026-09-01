const aportesMetasService=require('../services/aportes_metas.service')
const obtenerTodas=async(req,res)=>{
  try{
    const aportes=await aportesMetasService.obtenerTodas()
    res.status(200).json({
      ok:true,
      aportes
    })
  }catch(error){
    console.error('Error al obtener aportes:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener los aportes'
    })
  }
}
const obtenerPorId=async(req,res)=>{
  try{
    const {id}=req.params
    const aporte=await aportesMetasService.obtenerPorId(id)
    res.status(200).json({
      ok:true,
      aporte
    })
  }catch(error){
    console.error('Error al obtener aporte:',error)
    if(error.message==='Aporte no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener el aporte'
    })
  }
}
const obtenerPorMeta=async(req,res)=>{
  try{
    const {meta_id}=req.params
    const aportes=await aportesMetasService.obtenerPorMeta(meta_id)
    res.status(200).json({
      ok:true,
      aportes
    })
  }catch(error){
    console.error('Error al obtener aportes de la meta:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener los aportes de la meta'
    })
  }
}
const crear=async(req,res)=>{
  try{
    const {meta_id,monto,descripcion}=req.body
    const aporte=await aportesMetasService.crear(meta_id,monto,descripcion)
    res.status(201).json({
      ok:true,
      mensaje:'Aporte creado correctamente',
      aporte
    })
  }catch(error){
    console.error('Error al crear aporte:',error)
    if(error.code==='23503'){
      return res.status(404).json({
        ok:false,
        mensaje:'La meta de ahorro no existe'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al crear el aporte'
    })
  }
}
const actualizar=async(req,res)=>{
  try{
    const {id}=req.params
    const {meta_id,monto,descripcion}=req.body
    const aporte=await aportesMetasService.actualizar(id,meta_id,monto,descripcion)
    res.status(200).json({
      ok:true,
      mensaje:'Aporte actualizado correctamente',
      aporte
    })
  }catch(error){
    console.error('Error al actualizar aporte:',error)
    if(error.message==='Aporte no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    if(error.code==='23503'){
      return res.status(404).json({
        ok:false,
        mensaje:'La meta de ahorro no existe'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al actualizar el aporte'
    })
  }
}
const eliminar=async(req,res)=>{
  try{
    const {id}=req.params
    const aporte=await aportesMetasService.eliminar(id)
    res.status(200).json({
      ok:true,
      mensaje:'Aporte eliminado correctamente',
      aporte
    })
  }catch(error){
    console.error('Error al eliminar aporte:',error)
    if(error.message==='Aporte no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al eliminar el aporte'
    })
  }
}
module.exports={obtenerTodas,obtenerPorId,obtenerPorMeta,crear,actualizar,eliminar}