const iaService=require('../services/ia.service')
const dbService=require('../services/db.service')
const consultarIA=async(req,res)=>{
  try{
    const {pregunta,usuarioId}=req.body
    if(!pregunta){
      return res.status(400).json({
        error:'La pregunta es obligatoria'
      })
    }
    if(!usuarioId){
      return res.status(400).json({
        error:'El usuarioId es obligatorio'
      })
    }
    const contexto=await dbService.obtenerContextoIA(usuarioId)
    const sql=await iaService.generarSQL(pregunta,usuarioId,contexto)    
    const resultado=await dbService.ejecutarSQL(sql)   
    const respuestaFinal=await iaService.generarRespuesta(pregunta,resultado)
    res.json({ pregunta, sql, resultado, respuesta:respuestaFinal })
  }catch(err){
    console.error('Error consultando IA:',err)
    res.status(500).json({
      error:'Error al consultar IA',
      detalle:err.message
    })
  }
}
module.exports={ consultarIA }