jest.mock('../controllers/auth.controller',()=>({
  registrar:jest.fn((req,res)=>res.status(201).json({ok:true,usuario:{id:1,email:req.body.email}})),
  login:jest.fn((req,res)=>res.status(200).json({ok:true,usuario:{id:1,email:req.body.email},token:'fakeToken123'})),
  recuperarPassword:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Se envió el correo de recuperación'})),
  restablecerPassword:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Contraseña restablecida correctamente'})),
  getPerfil:jest.fn((req,res)=>res.status(200).json({ok:true,usuario:req.usuario}))
}))
const request=require('supertest')
const jwt=require('jsonwebtoken')
const Server=require('../core/server')
const authController=require('../controllers/auth.controller')
const server=new Server()
const app=server.getApp()
process.env.JWT_SECRET='test-secret'
describe('Auth routes',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('POST /api/auth/registrar registra un usuario',async()=>{
    const res=await request(app).post('/api/auth/registrar').send({nombre:'Ricardo',email:'TEST@TEST.COM',password:'123456'})
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ok:true,usuario:{id:1,email:'test@test.com'}})
    expect(authController.registrar).toHaveBeenCalled()
  })
  it('POST /api/auth/registrar rechaza datos inválidos',async()=>{
    const res=await request(app).post('/api/auth/registrar').send({nombre:'',email:'correo-invalido',password:'123'})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toEqual(expect.arrayContaining([
      'El nombre es obligatorio.',
      'El email no tiene un formato válido.',
      'La contraseña debe tener al menos 6 caracteres.'
    ]))
    expect(authController.registrar).not.toHaveBeenCalled()
  })
  it('POST /api/auth/login inicia sesión',async()=>{
    const res=await request(app).post('/api/auth/login').send({email:'TEST@TEST.COM',password:'123456'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,usuario:{id:1,email:'test@test.com'},token:'fakeToken123'})
    expect(authController.login).toHaveBeenCalled()
  })
  it('POST /api/auth/login rechaza datos inválidos',async()=>{
    const res=await request(app).post('/api/auth/login').send({email:'correo-invalido',password:''})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toEqual(expect.arrayContaining([
      'El email no tiene un formato válido.',
      'La contraseña es obligatoria.'
    ]))
    expect(authController.login).not.toHaveBeenCalled()
  })
  it('POST /api/auth/recuperar-password solicita recuperación',async()=>{
    const res=await request(app).post('/api/auth/recuperar-password').send({email:'TEST@TEST.COM'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,mensaje:'Se envió el correo de recuperación'})
    expect(authController.recuperarPassword).toHaveBeenCalled()
  })
  it('POST /api/auth/recuperar-password rechaza un email inválido',async()=>{
    const res=await request(app).post('/api/auth/recuperar-password').send({email:'correo-invalido'})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El email no tiene un formato válido.')
    expect(authController.recuperarPassword).not.toHaveBeenCalled()
  })
  it('POST /api/auth/restablecer-password cambia la contraseña',async()=>{
    const res=await request(app).post('/api/auth/restablecer-password').send({token:'token123',nuevaPassword:'Nueva123'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,mensaje:'Contraseña restablecida correctamente'})
    expect(authController.restablecerPassword).toHaveBeenCalled()
  })
  it('POST /api/auth/restablecer-password rechaza datos inválidos',async()=>{
    const res=await request(app).post('/api/auth/restablecer-password').send({token:'',nuevaPassword:'123'})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toEqual(expect.arrayContaining([
      'El token es obligatorio.',
      'La nueva contraseña debe tener al menos 6 caracteres.'
    ]))
    expect(authController.restablecerPassword).not.toHaveBeenCalled()
  })
  it('GET /api/auth/perfil responde 401 sin token',async()=>{
    const res=await request(app).get('/api/auth/perfil')
    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({error:'Token requerido'})
    expect(authController.getPerfil).not.toHaveBeenCalled()
  })
  it('GET /api/auth/perfil responde 401 con formato de token inválido',async()=>{
    const res=await request(app).get('/api/auth/perfil').set('Authorization','Token abc123')
    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({error:'Formato de token inválido'})
    expect(authController.getPerfil).not.toHaveBeenCalled()
  })
  it('GET /api/auth/perfil responde 401 con token inválido',async()=>{
    const res=await request(app).get('/api/auth/perfil').set('Authorization','Bearer token-invalido')
    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({error:'Token inválido'})
    expect(authController.getPerfil).not.toHaveBeenCalled()
  })
  it('GET /api/auth/perfil permite el acceso con un token válido',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET,{expiresIn:'2h'})
    const res=await request(app).get('/api/auth/perfil').set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,usuario:{id:1,email:'test@test.com'}})
    expect(authController.getPerfil).toHaveBeenCalled()
  })
})
