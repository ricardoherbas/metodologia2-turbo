const validateInputMetaAhorro=(req,res,next)=>{
  const {usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite}=req.body
  const error=[]
  if(usuario_id!==undefined&&(!Number.isInteger(Number(usuario_id))||Number(usuario_id)<=0)){
    error.push('El usuario_id debe ser un número entero válido.')
  }
  if(nombre!==undefined&&typeof nombre!=='string'){
    error.push('El nombre debe ser un texto válido.')
  }
  if(nombre!==undefined&&typeof nombre==='string'&&nombre.trim().length===0){
    error.push('El nombre no puede estar vacío.')
  }
  if(nombre!==undefined&&typeof nombre==='string'&&nombre.length>100){
    error.push('El nombre no puede superar los 100 caracteres.')
  }
  if(monto_objetivo!==undefined&&(!Number.isFinite(Number(monto_objetivo))||Number(monto_objetivo)<=0)){
    error.push('El monto_objetivo debe ser un número mayor que 0.')
  }
  if(monto_objetivo!==undefined&&String(monto_objetivo).includes('.')&&String(monto_objetivo).split('.')[1].length>2){
    error.push('El monto_objetivo no puede tener más de 2 decimales.')
  }
  if(monto_actual!==undefined&&(!Number.isFinite(Number(monto_actual))||Number(monto_actual)<0)){
    error.push('El monto_actual debe ser un número mayor o igual que 0.')
  }
  if(monto_actual!==undefined&&String(monto_actual).includes('.')&&String(monto_actual).split('.')[1].length>2){
    error.push('El monto_actual no puede tener más de 2 decimales.')
  }
  if(estado!==undefined&&typeof estado!=='string'){
    error.push('El estado debe ser un texto válido.')
  }
  if(estado!==undefined&&estado!=='en proceso'&&estado!=='completada'){
    error.push('El estado debe ser "en proceso" o "completada".')
  }
  if(fecha_limite!==undefined&&fecha_limite!==null&&fecha_limite!==''){
    if(typeof fecha_limite!=='string'){
      error.push('La fecha_limite debe ser un texto válido.')
    }else if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha_limite)){
      error.push('La fecha_limite debe tener el formato YYYY-MM-DD.')
    }
  }
  if(error.length>0){
    return res.status(400).json({error})
  }
  next()
}
module.exports={validateInputMetaAhorro}