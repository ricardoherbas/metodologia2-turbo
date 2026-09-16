const authService=require('../services/auth.service')

const login=async(req,res)=>{
  try{
    const {email,password}=req.body
    const resultado=await authService.login(email,password)
    res.status(200).json({
      ok:true,
      ...resultado
    })
  }catch(error){
    console.error('Error en login:',error.message)
    if(error.message==='Credenciales inválidas'){
      return res.status(401).json({
        ok:false,
        error:error.message
      })
    }
    res.status(500).json({
      ok:false,
      error:'Error al iniciar sesión'
    })
  }
}
const registrar=async(req,res)=>{
  try{
    const {nombre,email,password}=req.body
    const resultado=await authService.registrar(nombre,email,password)
    res.status(201).json({
      ok:true,
      ...resultado
    })
  }catch(error){
    console.error('Error en registro:',error.message)
    if(error.message==='El email ya está registrado'){
      return res.status(409).json({
        ok:false,
        error:error.message
      })
    }
    res.status(500).json({
      ok:false,
      error:'Error al registrar usuario'
    })
  }
}
const getPerfil=async(req,res)=>{
  try{
    const usuario=await authService.obtenerPerfil(req.usuario.id)
    res.status(200).json({
      ok:true,
      usuario
    })
  }catch(error){
    console.error('Error al obtener perfil:',error.message)
    if(error.message==='Usuario no encontrado'){
      return res.status(404).json({
        ok:false,
        error:error.message
      })
    }
    res.status(500).json({
      ok:false,
      error:'Error al obtener el perfil'
    })
  }
}
module.exports={login,registrar,getPerfil}