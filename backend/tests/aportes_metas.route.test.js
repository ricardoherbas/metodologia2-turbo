jest.mock('../controllers/aportes_metas.controller',()=>({
  obtenerTodas:jest.fn((req,res)=>res.status(200).json({ok:true,aportes:[]})),
  obtenerPorMeta:jest.fn((req,res)=>res.status(200).json({ok:true,aportes:[]})),
  obtenerPorId:jest.fn((req,res)=>res.status(200).json({ok:true,aporte:{id:1}})),
  crear:jest.fn((req,res)=>res.status(201).json({ok:true,mensaje:'Aporte creado correctamente',aporte:req.body})),
  actualizar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Aporte actualizado correctamente',aporte:{id:Number(req.params.id),...req.body}})),
  eliminar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Aporte eliminado correctamente'}))
}))
const express=require('express')
const request=require('supertest')
const jwt=require('jsonwebtoken')
const router=require('../routes/aportes_metas.route')
const controller=require('../controllers/aportes_metas.controller')
process.env.JWT_SECRET='test-secret'
const app=express()
app.use(express.json())
app.use('/api/aportes-metas',router)
const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
const auth={Authorization:`Bearer ${token}`}
describe('Rutas de aportes',()=>{
  beforeEach(()=>jest.clearAllMocks())
  it('GET /api/aportes-metas devuelve todos los aportes',async()=>{
    const res=await request(app).get('/api/aportes-metas').set(auth)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,aportes:[]})
    expect(controller.obtenerTodas).toHaveBeenCalled()
  })
  it('GET /api/aportes-metas/meta/:meta_id devuelve los aportes de una meta',async()=>{
    const res=await request(app).get('/api/aportes-metas/meta/1').set(auth)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,aportes:[]})
    expect(controller.obtenerPorMeta).toHaveBeenCalled()
  })
  it('GET /api/aportes-metas/:id devuelve un aporte',async()=>{
    const res=await request(app).get('/api/aportes-metas/1').set(auth)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,aporte:{id:1}})
    expect(controller.obtenerPorId).toHaveBeenCalled()
  })
  it('POST /api/aportes-metas crea un aporte',async()=>{
    const res=await request(app).post('/api/aportes-metas').set(auth).send({meta_id:1,monto:100,descripcion:'primer aporte'})
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ok:true,mensaje:'Aporte creado correctamente',aporte:{meta_id:1,monto:100,descripcion:'primer aporte'}})
    expect(controller.crear).toHaveBeenCalled()
  })
  it('POST /api/aportes-metas rechaza un meta_id inválido',async()=>{
    const res=await request(app).post('/api/aportes-metas').set(auth).send({meta_id:0,monto:100,descripcion:'primer aporte'})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El meta_id debe ser un número entero válido.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/aportes-metas rechaza un monto inválido',async()=>{
    const res=await request(app).post('/api/aportes-metas').set(auth).send({meta_id:1,monto:-100,descripcion:'primer aporte'})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto debe ser un número mayor que 0.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/aportes-metas rechaza un monto con más de 2 decimales',async()=>{
    const res=await request(app).post('/api/aportes-metas').set(auth).send({meta_id:1,monto:100.123,descripcion:'primer aporte'})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto no puede tener más de 2 decimales.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/aportes-metas rechaza una descripcion inválida',async()=>{
    const res=await request(app).post('/api/aportes-metas').set(auth).send({meta_id:1,monto:100,descripcion:123})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('La descripción debe ser un texto válido.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('PUT /api/aportes-metas/:id actualiza un aporte',async()=>{
    const res=await request(app).put('/api/aportes-metas/1').set(auth).send({meta_id:2,monto:250,descripcion:'aporte actualizado'})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,mensaje:'Aporte actualizado correctamente',aporte:{id:1,meta_id:2,monto:250,descripcion:'aporte actualizado'}})
    expect(controller.actualizar).toHaveBeenCalled()
  })
  it('PUT /api/aportes-metas/:id rechaza un meta_id inválido',async()=>{
    const res=await request(app).put('/api/aportes-metas/1').set(auth).send({meta_id:-1,monto:250,descripcion:'aporte actualizado'})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El meta_id debe ser un número entero válido.')
    expect(controller.actualizar).not.toHaveBeenCalled()
  })
  it('PUT /api/aportes-metas/:id rechaza un monto inválido',async()=>{
    const res=await request(app).put('/api/aportes-metas/1').set(auth).send({meta_id:2,monto:0,descripcion:'aporte actualizado'})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto debe ser un número mayor que 0.')
    expect(controller.actualizar).not.toHaveBeenCalled()
  })
  it('PUT /api/aportes-metas/:id rechaza una descripcion demasiado larga',async()=>{
    const descripcion='a'.repeat(256)
    const res=await request(app).put('/api/aportes-metas/1').set(auth).send({meta_id:2,monto:250,descripcion})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('La descripción no puede superar los 255 caracteres.')
    expect(controller.actualizar).not.toHaveBeenCalled()
  })
  it('DELETE /api/aportes-metas/:id elimina un aporte',async()=>{
    const res=await request(app).delete('/api/aportes-metas/1').set(auth)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,mensaje:'Aporte eliminado correctamente'})
    expect(controller.eliminar).toHaveBeenCalled()
  })
})
