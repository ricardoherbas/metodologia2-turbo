const movimientosService=require('../services/movimientos.service')
const obtenerTodas=async(req,res)=>{
  try{
    const movimientos=await movimientosService.obtenerTodas()
    res.status(200).json({
      ok:true,
      movimientos
    })
  }catch(error){
    console.error('Error al obtener movimientos:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener los movimientos'
    })
  }
}
const obtenerPorId=async(req,res)=>{
  try{
    const {id}=req.params
    const movimiento=await movimientosService.obtenerPorId(id)
    res.status(200).json({
      ok:true,
      movimiento
    })
  }catch(error){
    console.error('Error al obtener movimiento:',error)
    if(error.message==='Movimiento no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener el movimiento'
    })
  }
}
const obtenerPorUsuario=async(req,res)=>{
  try{
    const {usuario_id}=req.params
    const movimientos=await movimientosService.obtenerPorUsuario(usuario_id)
    res.status(200).json({
      ok:true,
      movimientos
    })
  }catch(error){
    console.error('Error al obtener movimientos del usuario:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener los movimientos del usuario'
    })
  }
}
const obtenerPorCategoria=async(req,res)=>{
  try{
    const {categoria_id}=req.params
    const movimientos=await movimientosService.obtenerPorCategoria(categoria_id)
    res.status(200).json({
      ok:true,
      movimientos
    })
  }catch(error){
    console.error('Error al obtener movimientos de la categoría:',error)
    res.status(500).json({
      ok:false,
      mensaje:'Error al obtener los movimientos de la categoría'
    })
  }
}
const crear=async(req,res)=>{
  try{
    const {usuario_id,categoria_id,tipo,monto,descripcion,fecha}=req.body
    const movimiento=await movimientosService.crear(usuario_id,categoria_id,tipo,monto,descripcion,fecha)
    res.status(201).json({
      ok:true,
      mensaje:'Movimiento creado correctamente',
      movimiento
    })
  }catch(error){
    console.error('Error al crear movimiento:',error)
    if(error.code==='23503'){
      if(error.constraint&&error.constraint.includes('usuario')){
        return res.status(404).json({
          ok:false,
          mensaje:'El usuario no existe'
        })
      }
      if(error.constraint&&error.constraint.includes('categoria')){
        return res.status(404).json({
          ok:false,
          mensaje:'La categoría no existe'
        })
      }
      return res.status(404).json({
        ok:false,
        mensaje:'El usuario o la categoría no existen'
      })
    }
    if(error.code==='23514'){
      return res.status(400).json({
        ok:false,
        mensaje:'El tipo debe ser "gasto" o "ingreso"'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al crear el movimiento'
    })
  }
}
const actualizar=async(req,res)=>{
  try{
    const {id}=req.params
    const {usuario_id,categoria_id,tipo,monto,descripcion,fecha}=req.body
    const movimiento=await movimientosService.actualizar(id,usuario_id,categoria_id,tipo,monto,descripcion,fecha)
    res.status(200).json({
      ok:true,
      mensaje:'Movimiento actualizado correctamente',
      movimiento
    })
  }catch(error){
    console.error('Error al actualizar movimiento:',error)
    if(error.message==='Movimiento no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    if(error.code==='23503'){
      if(error.constraint&&error.constraint.includes('usuario')){
        return res.status(404).json({
          ok:false,
          mensaje:'El usuario no existe'
        })
      }
      if(error.constraint&&error.constraint.includes('categoria')){
        return res.status(404).json({
          ok:false,
          mensaje:'La categoría no existe'
        })
      }
      return res.status(404).json({
        ok:false,
        mensaje:'El usuario o la categoría no existen'
      })
    }
    if(error.code==='23514'){
      return res.status(400).json({
        ok:false,
        mensaje:'El tipo debe ser "gasto" o "ingreso"'
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al actualizar el movimiento'
    })
  }
}
const eliminar=async(req,res)=>{
  try{
    const {id}=req.params
    const movimiento=await movimientosService.eliminar(id)
    res.status(200).json({
      ok:true,
      mensaje:'Movimiento eliminado correctamente',
      movimiento
    })
  }catch(error){
    console.error('Error al eliminar movimiento:',error)
    if(error.message==='Movimiento no encontrado'){
      return res.status(404).json({
        ok:false,
        mensaje:error.message
      })
    }
    res.status(500).json({
      ok:false,
      mensaje:'Error al eliminar el movimiento'
    })
  }
}
module.exports={obtenerTodas,obtenerPorId,obtenerPorUsuario,obtenerPorCategoria,crear,actualizar,eliminar}