const validateInputMovimiento=(req,res,next)=>{
  const {usuario_id,categoria_id,tipo,monto,descripcion,fecha}=req.body
  const error=[]
  if(usuario_id!==undefined&&(!Number.isInteger(Number(usuario_id))||Number(usuario_id)<=0)){
    error.push('El usuario_id debe ser un número entero válido.')
  }
  if(categoria_id!==undefined&&(!Number.isInteger(Number(categoria_id))||Number(categoria_id)<=0)){
    error.push('El categoria_id debe ser un número entero válido.')
  }
  if(tipo!==undefined&&typeof tipo!=='string'){
    error.push('El tipo debe ser un texto válido.')
  }
  if(tipo!==undefined&&tipo!=='gasto'&&tipo!=='ingreso'){
    error.push('El tipo debe ser "gasto" o "ingreso".')
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
  if(fecha!==undefined&&fecha!==null&&fecha!==''){
    if(typeof fecha!=='string'){
      error.push('La fecha debe ser un texto válido.')
    }else if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha)){
      error.push('La fecha debe tener el formato YYYY-MM-DD.')
    }
  }
  if(error.length>0){
    return res.status(400).json({error})
  }
  next()
}
module.exports={validateInputMovimiento}