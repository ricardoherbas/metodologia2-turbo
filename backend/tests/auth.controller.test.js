const {login,registrar,getPerfil,recuperarPassword,restablecerPassword}=require('../controllers/auth.controller')
const authService=require('../services/auth.service')
jest.mock('../services/auth.service')
describe('authController',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('login responde 200 con usuario y token',async()=>{
    const req={body:{email:'test@test.com',password:'1234'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.login.mockResolvedValue({usuario:{id:1,email:'test@test.com'},token:'abc123'})
    await login(req,res)
    expect(authService.login).toHaveBeenCalledWith('test@test.com','1234')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,usuario:{id:1,email:'test@test.com'},token:'abc123'})
  })
  it('login responde 401 con credenciales inválidas',async()=>{
    const req={body:{email:'test@test.com',password:'incorrecta'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.login.mockRejectedValue(new Error('Credenciales inválidas'))
    await login(req,res)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Credenciales inválidas'})
  })
  it('login responde 500 ante un error interno',async()=>{
    const req={body:{email:'test@test.com',password:'1234'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.login.mockRejectedValue(new Error('Error de base de datos'))
    await login(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Error al iniciar sesión'})
  })
  it('registrar responde 201 cuando registra el usuario',async()=>{
    const req={body:{nombre:'Ricardo',email:'test@test.com',password:'1234'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.registrar.mockResolvedValue({usuario:{id:1,nombre:'Ricardo',email:'test@test.com'}})
    await registrar(req,res)
    expect(authService.registrar).toHaveBeenCalledWith('Ricardo','test@test.com','1234')
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ok:true,usuario:{id:1,nombre:'Ricardo',email:'test@test.com'}})
  })
  it('registrar responde 409 cuando el email ya está registrado',async()=>{
    const req={body:{nombre:'Ricardo',email:'test@test.com',password:'1234'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.registrar.mockRejectedValue(new Error('El email ya está registrado'))
    await registrar(req,res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'El email ya está registrado'})
  })
  it('registrar responde 500 ante un error interno',async()=>{
    const req={body:{nombre:'Ricardo',email:'test@test.com',password:'1234'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.registrar.mockRejectedValue(new Error('Error de base de datos'))
    await registrar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Error al registrar usuario'})
  })
  it('getPerfil responde 200 con el perfil',async()=>{
    const req={usuario:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.obtenerPerfil.mockResolvedValue({id:1,nombre:'Ricardo',email:'test@test.com'})
    await getPerfil(req,res)
    expect(authService.obtenerPerfil).toHaveBeenCalledWith(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,usuario:{id:1,nombre:'Ricardo',email:'test@test.com'}})
  })
  it('getPerfil responde 404 cuando el usuario no existe',async()=>{
    const req={usuario:{id:99}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.obtenerPerfil.mockRejectedValue(new Error('Usuario no encontrado'))
    await getPerfil(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Usuario no encontrado'})
  })
  it('getPerfil responde 500 ante un error interno',async()=>{
    const req={usuario:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.obtenerPerfil.mockRejectedValue(new Error('Error de base de datos'))
    await getPerfil(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Error al obtener el perfil'})
  })
  it('recuperarPassword responde 200 cuando se solicita la recuperación',async()=>{
    const req={body:{email:'test@test.com'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.recuperarPassword.mockResolvedValue({mensaje:'Se envió el correo de recuperación'})
    await recuperarPassword(req,res)
    expect(authService.recuperarPassword).toHaveBeenCalledWith('test@test.com')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Se envió el correo de recuperación'})
  })
  it('recuperarPassword responde 404 cuando el usuario no existe',async()=>{
    const req={body:{email:'noexiste@test.com'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.recuperarPassword.mockRejectedValue(new Error('Usuario no encontrado'))
    await recuperarPassword(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Usuario no encontrado'})
  })
  it('recuperarPassword responde 500 ante un error interno',async()=>{
    const req={body:{email:'test@test.com'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.recuperarPassword.mockRejectedValue(new Error('Error de correo'))
    await recuperarPassword(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Error al solicitar recuperación de contraseña'})
  })
  it('restablecerPassword responde 200 cuando cambia la contraseña',async()=>{
    const req={body:{token:'token123',nuevaPassword:'nueva123'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.restablecerPassword.mockResolvedValue({mensaje:'Contraseña restablecida correctamente'})
    await restablecerPassword(req,res)
    expect(authService.restablecerPassword).toHaveBeenCalledWith('token123','nueva123')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Contraseña restablecida correctamente'})
  })
  it('restablecerPassword responde 400 cuando el token es inválido',async()=>{
    const req={body:{token:'token-invalido',nuevaPassword:'nueva123'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.restablecerPassword.mockRejectedValue(new Error('Token inválido'))
    await restablecerPassword(req,res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Token inválido'})
  })
  it('restablecerPassword responde 400 cuando el token ya fue utilizado',async()=>{
    const req={body:{token:'token-usado',nuevaPassword:'nueva123'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.restablecerPassword.mockRejectedValue(new Error('El token ya fue utilizado'))
    await restablecerPassword(req,res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'El token ya fue utilizado'})
  })
  it('restablecerPassword responde 400 cuando el token expiró',async()=>{
    const req={body:{token:'token-expirado',nuevaPassword:'nueva123'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.restablecerPassword.mockRejectedValue(new Error('El token ha expirado'))
    await restablecerPassword(req,res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'El token ha expirado'})
  })
  it('restablecerPassword responde 500 ante un error interno',async()=>{
    const req={body:{token:'token123',nuevaPassword:'nueva123'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    authService.restablecerPassword.mockRejectedValue(new Error('Error de base de datos'))
    await restablecerPassword(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,error:'Error al restablecer contraseña'})
  })
})
