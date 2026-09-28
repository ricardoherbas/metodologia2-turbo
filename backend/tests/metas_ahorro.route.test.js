jest.mock('../middlewares/auth.middleware',()=>({
  verificarToken:(req,res,next)=>next()
}))
jest.mock('../controllers/metas_ahorro.controller',()=>({
  obtenerTodas:jest.fn((req,res)=>res.status(200).json({ok:true,metas:[]})),
  obtenerPorUsuario:jest.fn((req,res)=>res.status(200).json({ok:true,metas:[]})),
  obtenerPorId:jest.fn((req,res)=>res.status(200).json({ok:true,meta:{id:1}})),
  crear:jest.fn((req,res)=>res.status(201).json({ok:true,mensaje:'Meta creada correctamente',meta:{id:1,nombre:req.body.nombre}})),
  actualizar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Meta actualizada correctamente',meta:{id:req.params.id}})),
  eliminar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Meta eliminada correctamente',meta:{id:req.params.id}}))
}))
const request=require('supertest')
const Server=require('../core/server')
const server=new Server()
const app=server.getApp()
const controller=require('../controllers/metas_ahorro.controller')
describe('Metas de ahorro routes',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('GET /api/metas-ahorro devuelve todas las metas',async()=>{
    const res=await request(app)
      .get('/api/metas-ahorro')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.obtenerTodas).toHaveBeenCalled()
  })
  it('GET /api/metas-ahorro/usuario/:usuario_id devuelve las metas del usuario',async()=>{
    const res=await request(app)
      .get('/api/metas-ahorro/usuario/1')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.obtenerPorUsuario).toHaveBeenCalled()
  })
  it('GET /api/metas-ahorro/:id devuelve una meta',async()=>{
    const res=await request(app)
      .get('/api/metas-ahorro/1')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.meta.id).toBe(1)
    expect(controller.obtenerPorId).toHaveBeenCalled()
  })
  it('POST /api/metas-ahorro crea meta',async()=>{
    const res=await request(app)
      .post('/api/metas-ahorro')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        nombre:'Viaje',
        monto_objetivo:1000,
        monto_actual:0,
        estado:'en proceso',
        fecha_limite:'2026-12-31'
      })
    expect(res.statusCode).toBe(201)
    expect(res.body.ok).toBe(true)
    expect(res.body.meta.nombre).toBe('Viaje')
    expect(controller.crear).toHaveBeenCalled()
  })
  it('POST /api/metas-ahorro rechaza usuario_id inválido',async()=>{
    const res=await request(app)
      .post('/api/metas-ahorro')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:0,
        nombre:'Viaje',
        monto_objetivo:1000
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El usuario_id debe ser un número entero válido.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/metas-ahorro rechaza nombre vacío',async()=>{
    const res=await request(app)
      .post('/api/metas-ahorro')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        nombre:'   ',
        monto_objetivo:1000
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El nombre no puede estar vacío.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/metas-ahorro rechaza monto_objetivo inválido',async()=>{
    const res=await request(app)
      .post('/api/metas-ahorro')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        nombre:'Viaje',
        monto_objetivo:-100
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto_objetivo debe ser un número mayor que 0.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/metas-ahorro rechaza más de 2 decimales en monto_objetivo',async()=>{
    const res=await request(app)
      .post('/api/metas-ahorro')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        nombre:'Viaje',
        monto_objetivo:100.123
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto_objetivo no puede tener más de 2 decimales.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/metas-ahorro rechaza estado inválido',async()=>{
    const res=await request(app)
      .post('/api/metas-ahorro')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        nombre:'Viaje',
        monto_objetivo:1000,
        estado:'pendiente'
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El estado debe ser "en proceso" o "completada".')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/metas-ahorro rechaza fecha_limite inválida',async()=>{
    const res=await request(app)
      .post('/api/metas-ahorro')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        nombre:'Viaje',
        monto_objetivo:1000,
        fecha_limite:'31-12-2026'
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('La fecha_limite debe tener el formato YYYY-MM-DD.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('PUT /api/metas-ahorro/:id actualiza una meta',async()=>{
    const res=await request(app)
      .put('/api/metas-ahorro/1')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        nombre:'Viaje actualizado',
        monto_objetivo:1500,
        monto_actual:500,
        estado:'en proceso',
        fecha_limite:'2026-12-31'
      })
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.actualizar).toHaveBeenCalled()
  })
  it('PUT /api/metas-ahorro/:id rechaza monto_actual negativo',async()=>{
    const res=await request(app)
      .put('/api/metas-ahorro/1')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        nombre:'Viaje',
        monto_objetivo:1000,
        monto_actual:-1,
        estado:'en proceso'
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto_actual debe ser un número mayor o igual que 0.')
    expect(controller.actualizar).not.toHaveBeenCalled()
  })
  it('DELETE /api/metas-ahorro/:id elimina una meta',async()=>{
    const res=await request(app)
      .delete('/api/metas-ahorro/1')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.eliminar).toHaveBeenCalled()
  })
})
