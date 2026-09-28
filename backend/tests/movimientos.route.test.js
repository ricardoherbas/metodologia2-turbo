jest.mock('../middlewares/auth.middleware',()=>({
  verificarToken:(req,res,next)=>next()
}))
jest.mock('../controllers/movimientos.controller',()=>({
  obtenerTodas:jest.fn((req,res)=>res.status(200).json({ok:true,movimientos:[]})),
  obtenerPorUsuario:jest.fn((req,res)=>res.status(200).json({ok:true,movimientos:[]})),
  obtenerPorCategoria:jest.fn((req,res)=>res.status(200).json({ok:true,movimientos:[]})),
  obtenerPorId:jest.fn((req,res)=>res.status(200).json({ok:true,movimiento:{id:1}})),
  crear:jest.fn((req,res)=>res.status(201).json({ok:true,mensaje:'Movimiento creado correctamente',movimiento:{id:1,tipo:req.body.tipo,monto:req.body.monto}})),
  actualizar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Movimiento actualizado correctamente',movimiento:{id:req.params.id}})),
  eliminar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Movimiento eliminado correctamente',movimiento:{id:req.params.id}}))
}))
const request=require('supertest')
const Server=require('../core/server')
const server=new Server()
const app=server.getApp()
const controller=require('../controllers/movimientos.controller')
describe('Movimientos routes',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('GET /api/movimientos devuelve todos los movimientos',async()=>{
    const res=await request(app)
      .get('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.obtenerTodas).toHaveBeenCalled()
  })
  it('GET /api/movimientos/usuario/:usuario_id devuelve los movimientos del usuario',async()=>{
    const res=await request(app)
      .get('/api/movimientos/usuario/1')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.obtenerPorUsuario).toHaveBeenCalled()
  })
  it('GET /api/movimientos/categoria/:categoria_id devuelve los movimientos de la categoria',async()=>{
    const res=await request(app)
      .get('/api/movimientos/categoria/2')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.obtenerPorCategoria).toHaveBeenCalled()
  })
  it('GET /api/movimientos/:id devuelve un movimiento',async()=>{
    const res=await request(app)
      .get('/api/movimientos/1')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.movimiento.id).toBe(1)
    expect(controller.obtenerPorId).toHaveBeenCalled()
  })
  it('POST /api/movimientos crea movimiento',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'ingreso',
        monto:500,
        descripcion:'sueldo',
        fecha:'2026-09-01'
      })
    expect(res.statusCode).toBe(201)
    expect(res.body.ok).toBe(true)
    expect(res.body.movimiento.tipo).toBe('ingreso')
    expect(res.body.movimiento.monto).toBe(500)
    expect(controller.crear).toHaveBeenCalled()
  })
  it('POST /api/movimientos rechaza usuario_id inválido',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:0,
        categoria_id:2,
        tipo:'ingreso',
        monto:500
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El usuario_id debe ser un número entero válido.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/movimientos rechaza categoria_id inválido',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:0,
        tipo:'ingreso',
        monto:500
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El categoria_id debe ser un número entero válido.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/movimientos rechaza tipo inválido',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'ahorro',
        monto:500
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El tipo debe ser "gasto" o "ingreso".')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/movimientos rechaza monto inválido',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'gasto',
        monto:0
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto debe ser un número mayor que 0.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/movimientos rechaza monto con más de 2 decimales',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'gasto',
        monto:100.123
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto no puede tener más de 2 decimales.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/movimientos rechaza descripcion que no es texto',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'gasto',
        monto:500,
        descripcion:123
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('La descripción debe ser un texto válido.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/movimientos rechaza descripcion demasiado larga',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'gasto',
        monto:500,
        descripcion:'a'.repeat(256)
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('La descripción no puede superar los 255 caracteres.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('POST /api/movimientos rechaza fecha inválida',async()=>{
    const res=await request(app)
      .post('/api/movimientos')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'gasto',
        monto:500,
        fecha:'01-09-2026'
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('La fecha debe tener el formato YYYY-MM-DD.')
    expect(controller.crear).not.toHaveBeenCalled()
  })
  it('PUT /api/movimientos/:id actualiza movimiento',async()=>{
    const res=await request(app)
      .put('/api/movimientos/1')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'gasto',
        monto:750,
        descripcion:'compra',
        fecha:'2026-09-03'
      })
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.actualizar).toHaveBeenCalled()
  })
  it('PUT /api/movimientos/:id rechaza datos inválidos',async()=>{
    const res=await request(app)
      .put('/api/movimientos/1')
      .set('Authorization','Bearer fakeToken')
      .send({
        usuario_id:1,
        categoria_id:2,
        tipo:'gasto',
        monto:-100
      })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toContain('El monto debe ser un número mayor que 0.')
    expect(controller.actualizar).not.toHaveBeenCalled()
  })
  it('DELETE /api/movimientos/:id elimina movimiento',async()=>{
    const res=await request(app)
      .delete('/api/movimientos/1')
      .set('Authorization','Bearer fakeToken')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(controller.eliminar).toHaveBeenCalled()
  })
})
