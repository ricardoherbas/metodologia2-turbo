const validateInputAporteMeta=(req,res,next)=>{
  const {meta_id,monto,descripcion}=req.body
  const error=[]
  if(meta_id!==undefined&&(!Number.isInteger(Number(meta_id))||Number(meta_id)<=0)){
    error.push('El meta_id debe ser un número entero válido.')
  }
  if(monto!==undefined&&(!Number.isFinite(Number(monto))||Number(monto)<=0)){
    error.push('El monto debe ser un número mayor que 0.')
  }
  if(monto!==undefined&&String(monto).includes('.')&&String(monto).split('.')[1].length>2){
    error.push('El monto no puede tener más de 2 decimales.')
  }
  if(descripcion!==undefined&&typeof descripcion!=='string'){
    error.push('La descripción debe ser un texto válido.')
  }
  if(descripcion!==undefined&&typeof descripcion==='string'&&descripcion.length>255){
    error.push('La descripción no puede superar los 255 caracteres.')
  }
  if(error.length>0){
    return res.status(400).json({error})
  }
  next()
}
module.exports={validateInputAporteMeta}