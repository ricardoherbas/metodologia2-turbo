const validateInputUsuario=(req,res,next)=>{
  const {nombre,email,password}=req.body
  const error=[]
  if(nombre===undefined){
    error.push('El nombre es obligatorio.')
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
  if(email===undefined){
    error.push('El email es obligatorio.')
  }
  if(email!==undefined&&typeof email!=='string'){
    error.push('El email debe ser un texto válido.')
  }
  if(email!==undefined&&typeof email==='string'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    error.push('El email no tiene un formato válido.')
  }
  if(email!==undefined&&typeof email==='string'&&email.length>150){
    error.push('El email no puede superar los 150 caracteres.')
  }
  if(password===undefined){
    error.push('La contraseña es obligatoria.')
  }
  if(password!==undefined&&typeof password!=='string'){
    error.push('La contraseña debe ser un texto válido.')
  }
  if(password!==undefined&&typeof password==='string'&&password.length<6){
    error.push('La contraseña debe tener al menos 6 caracteres.')
  }
  if(password!==undefined&&typeof password==='string'&&password.length>255){
    error.push('La contraseña no puede superar los 255 caracteres.')
  }
  if(error.length>0){
    return res.status(400).json({error})
  }
  req.body.nombre=nombre.trim()
  req.body.email=email.trim().toLowerCase()
  next()
}
module.exports={validateInputUsuario}