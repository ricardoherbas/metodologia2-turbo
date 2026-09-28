jest.mock('../controllers/usuarios.controller',()=>({
  obtenerTodas:jest.fn((req,res)=>res.status(200).json({ok:true,usuarios:[]})),
  obtenerPorId:jest.fn((req,res)=>res.status(200).json({ok:true,usuario:{id:req.params.id}})),
  crear:jest.fn((req,res)=>res.status(201).json({ok:true,mensaje:'Usuario creado correctamente',usuario:req.body})),
  actualizar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Usuario actualizado correctamente',usuario:{id:req.params.id,...req.body}})),
  eliminar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Usuario eliminado correctamente',usuario:{id:req.params.id}}))
}))

const request=require('supertest')
const jwt=require('jsonwebtoken')
const Server=require('../core/server')
const usuariosController=require('../controllers/usuarios.controller')

process.env.JWT_SECRET='test-secret'

const server=new Server()
const app=server.getApp()

const generarToken=()=>{
  return jwt.sign(
    {id:1,email:'test@test.com'},
    process.env.JWT_SECRET
  )
}

describe('Usuarios routes',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  describe('GET /api/usuarios',()=>{
    test('obtiene todos los usuarios con token válido',async()=>{
      const res=await request(app)
        .get('/api/usuarios')
        .set('Authorization',`Bearer ${generarToken()}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({
        ok:true,
        usuarios:[]
      })
      expect(usuariosController.obtenerTodas).toHaveBeenCalled()
    })
    test('rechaza la petición sin token',async()=>{
      const res=await request(app)
        .get('/api/usuarios')
      expect(res.statusCode).toBe(401)
      expect(res.body).toEqual({
        error:'Token requerido'
      })
      expect(usuariosController.obtenerTodas).not.toHaveBeenCalled()
    })
  })
  describe('GET /api/usuarios/:id',()=>{
    test('obtiene un usuario con token válido',async()=>{
      const res=await request(app)
        .get('/api/usuarios/1')
        .set('Authorization',`Bearer ${generarToken()}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({
        ok:true,
        usuario:{id:'1'}
      })
      expect(usuariosController.obtenerPorId).toHaveBeenCalled()
    })
    test('rechaza un token inválido',async()=>{
      const res=await request(app)
        .get('/api/usuarios/1')
        .set('Authorization','Bearer token-invalido')
      expect(res.statusCode).toBe(401)
      expect(res.body).toEqual({
        error:'Token inválido'
      })
      expect(usuariosController.obtenerPorId).not.toHaveBeenCalled()
    })
  })
  describe('POST /api/usuarios',()=>{
    test('crea usuario con datos válidos',async()=>{
      const res=await request(app)
        .post('/api/usuarios')
        .set('Authorization',`Bearer ${generarToken()}`)
        .send({
          nombre:'Ricardo',
          email:'test@test.com',
          password:'123456'
        })
      expect(res.statusCode).toBe(201)
      expect(res.body.ok).toBe(true)
      expect(res.body.usuario).toEqual({
        nombre:'Ricardo',
        email:'test@test.com',
        password:'123456'
      })
      expect(usuariosController.crear).toHaveBeenCalled()
    })
    test('rechaza datos inválidos del usuario',async()=>{
      const res=await request(app)
        .post('/api/usuarios')
        .set('Authorization',`Bearer ${generarToken()}`)
        .send({
          nombre:'',
          email:'correo-invalido',
          password:'123'
        })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toEqual(expect.arrayContaining([
        'El nombre no puede estar vacío.',
        'El email no tiene un formato válido.',
        'La contraseña debe tener al menos 6 caracteres.'
      ]))
      expect(usuariosController.crear).not.toHaveBeenCalled()
    })
    test('rechaza la petición sin token',async()=>{
      const res=await request(app)
        .post('/api/usuarios')
        .send({
          nombre:'Ricardo',
          email:'test@test.com',
          password:'123456'
        })
      expect(res.statusCode).toBe(401)
      expect(usuariosController.crear).not.toHaveBeenCalled()
    })
  })
  describe('PUT /api/usuarios/:id',()=>{
    test('actualiza usuario con datos válidos',async()=>{
      const res=await request(app)
        .put('/api/usuarios/1')
        .set('Authorization',`Bearer ${generarToken()}`)
        .send({
          nombre:'Ricardo actualizado',
          email:'nuevo@test.com',
          password:'123456'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.ok).toBe(true)
      expect(res.body.usuario).toEqual({
        id:'1',
        nombre:'Ricardo actualizado',
        email:'nuevo@test.com',
        password:'123456'
      })
      expect(usuariosController.actualizar).toHaveBeenCalled()
    })
    test('rechaza datos inválidos',async()=>{
      const res=await request(app)
        .put('/api/usuarios/1')
        .set('Authorization',`Bearer ${generarToken()}`)
        .send({
          nombre:'Ricardo',
          email:'correo-invalido',
          password:'123'
        })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toEqual(expect.arrayContaining([
        'El email no tiene un formato válido.',
        'La contraseña debe tener al menos 6 caracteres.'
      ]))
      expect(usuariosController.actualizar).not.toHaveBeenCalled()
    })
    test('rechaza la petición sin token',async()=>{
      const res=await request(app)
        .put('/api/usuarios/1')
        .send({
          nombre:'Ricardo',
          email:'test@test.com',
          password:'123456'
        })
      expect(res.statusCode).toBe(401)
      expect(usuariosController.actualizar).not.toHaveBeenCalled()
    })
  })
  describe('DELETE /api/usuarios/:id',()=>{
    test('elimina usuario con token válido',async()=>{
      const res=await request(app)
        .delete('/api/usuarios/1')
        .set('Authorization',`Bearer ${generarToken()}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({
        ok:true,
        mensaje:'Usuario eliminado correctamente',
        usuario:{id:'1'}
      })
      expect(usuariosController.eliminar).toHaveBeenCalled()
    })
    test('rechaza la petición sin token',async()=>{
      const res=await request(app)
        .delete('/api/usuarios/1')
      expect(res.statusCode).toBe(401)
      expect(usuariosController.eliminar).not.toHaveBeenCalled()
    })
  })
})
