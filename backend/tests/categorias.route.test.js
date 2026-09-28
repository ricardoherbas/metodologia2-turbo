jest.mock('../controllers/categorias.controller',()=>({
  obtenerTodas:jest.fn((req,res)=>res.status(200).json({ok:true,categorias:[{id:1,nombre:'Alimentos'}]})),
  obtenerPorId:jest.fn((req,res)=>res.status(200).json({ok:true,categoria:{id:1,nombre:'Alimentos'}})),
  crear:jest.fn((req,res)=>res.status(201).json({ok:true,mensaje:'Categoría creada correctamente',categoria:{id:1,nombre:req.body.nombre}})),
  actualizar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Categoría actualizada correctamente',categoria:{id:Number(req.params.id),nombre:req.body.nombre}})),
  eliminar:jest.fn((req,res)=>res.status(200).json({ok:true,mensaje:'Categoría eliminada correctamente',categoria:{id:Number(req.params.id),nombre:'Alimentos'}}))
}))
const request=require('supertest')
const jwt=require('jsonwebtoken')
const Server=require('../core/server')
const categoriasController=require('../controllers/categorias.controller')
const server=new Server()
const app=server.getApp()
process.env.JWT_SECRET='test-secret'
describe('Categorias routes',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('GET /api/categorias obtiene todas las categorías',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const res=await request(app).get('/api/categorias').set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,categorias:[{id:1,nombre:'Alimentos'}]})
    expect(categoriasController.obtenerTodas).toHaveBeenCalled()
  })
  it('GET /api/categorias/:id obtiene una categoría',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const res=await request(app).get('/api/categorias/1').set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,categoria:{id:1,nombre:'Alimentos'}})
    expect(categoriasController.obtenerPorId).toHaveBeenCalled()
  })
  it('POST /api/categorias crea categoría',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const res=await request(app).post('/api/categorias').set('Authorization',`Bearer ${token}`).send({nombre:'  Alimentos  '})
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ok:true,mensaje:'Categoría creada correctamente',categoria:{id:1,nombre:'Alimentos'}})
    expect(categoriasController.crear).toHaveBeenCalled()
  })
  it('POST /api/categorias rechaza una categoría sin nombre',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const res=await request(app).post('/api/categorias').set('Authorization',`Bearer ${token}`).send({})
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({errors:['El nombre de la categoría es obligatorio']})
    expect(categoriasController.crear).not.toHaveBeenCalled()
  })
  it('POST /api/categorias rechaza un nombre vacío',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const res=await request(app).post('/api/categorias').set('Authorization',`Bearer ${token}`).send({nombre:'   '})
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({errors:['El nombre de la categoría no puede estar vacío']})
    expect(categoriasController.crear).not.toHaveBeenCalled()
  })
  it('POST /api/categorias rechaza un nombre mayor a 50 caracteres',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const nombre='A'.repeat(51)
    const res=await request(app).post('/api/categorias').set('Authorization',`Bearer ${token}`).send({nombre})
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({errors:['El nombre de la categoría no puede superar los 50 caracteres']})
    expect(categoriasController.crear).not.toHaveBeenCalled()
  })
  it('PUT /api/categorias/:id actualiza una categoría',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const res=await request(app).put('/api/categorias/1').set('Authorization',`Bearer ${token}`).send({nombre:'  Comida  '})
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,mensaje:'Categoría actualizada correctamente',categoria:{id:1,nombre:'Comida'}})
    expect(categoriasController.actualizar).toHaveBeenCalled()
  })
  it('PUT /api/categorias/:id rechaza datos inválidos',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const res=await request(app).put('/api/categorias/1').set('Authorization',`Bearer ${token}`).send({nombre:123})
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({errors:['El nombre de la categoría debe ser texto']})
    expect(categoriasController.actualizar).not.toHaveBeenCalled()
  })
  it('DELETE /api/categorias/:id elimina una categoría',async()=>{
    const token=jwt.sign({id:1,email:'test@test.com'},process.env.JWT_SECRET)
    const res=await request(app).delete('/api/categorias/1').set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ok:true,mensaje:'Categoría eliminada correctamente',categoria:{id:1,nombre:'Alimentos'}})
    expect(categoriasController.eliminar).toHaveBeenCalled()
  })
  it('GET /api/categorias rechaza la petición sin token',async()=>{
    const res=await request(app).get('/api/categorias')
    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({error:'Token requerido'})
    expect(categoriasController.obtenerTodas).not.toHaveBeenCalled()
  })
  it('POST /api/categorias rechaza un token inválido',async()=>{
    const res=await request(app).post('/api/categorias').set('Authorization','Bearer token-invalido').send({nombre:'Alimentos'})
    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({error:'Token inválido'})
    expect(categoriasController.crear).not.toHaveBeenCalled()
  })
})
