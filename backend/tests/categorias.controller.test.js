const {obtenerTodas,obtenerPorId,crear,actualizar,eliminar}=require('../controllers/categorias.controller')
const service=require('../services/categorias.service')
jest.mock('../services/categorias.service')
describe('categoriasController',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('obtenerTodas responde 200 con las categorías',async()=>{
    const req={}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerTodas.mockResolvedValue([
      {id:1,nombre:'Alimentos'},
      {id:2,nombre:'Transporte'}
    ])
    await obtenerTodas(req,res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      ok:true,
      categorias:[
        {id:1,nombre:'Alimentos'},
        {id:2,nombre:'Transporte'}
      ]
    })
  })
  it('obtenerTodas responde 500 ante un error',async()=>{
    const req={}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerTodas.mockRejectedValue(new Error('DB error'))
    await obtenerTodas(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'Error al obtener las categorías'
    })
  })
  it('obtenerPorId responde 200 con la categoría',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerPorId.mockResolvedValue({id:1,nombre:'Alimentos'})
    await obtenerPorId(req,res)
    expect(service.obtenerPorId).toHaveBeenCalledWith(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      ok:true,
      categoria:{id:1,nombre:'Alimentos'}
    })
  })
  it('obtenerPorId responde 404 si la categoría no existe',async()=>{
    const req={params:{id:99}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerPorId.mockRejectedValue(new Error('Categoría no encontrada'))
    await obtenerPorId(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'Categoría no encontrada'
    })
  })
  it('obtenerPorId responde 500 ante un error interno',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerPorId.mockRejectedValue(new Error('DB error'))
    await obtenerPorId(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'Error al obtener la categoría'
    })
  })
  it('crear responde 201 con categoría',async()=>{
    const req={body:{nombre:'Alimentos'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.crear.mockResolvedValue({id:1,nombre:'Alimentos'})
    await crear(req,res)
    expect(service.crear).toHaveBeenCalledWith('Alimentos')
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      ok:true,
      mensaje:'Categoría creada correctamente',
      categoria:{id:1,nombre:'Alimentos'}
    })
  })
  it('crear responde 409 si la categoría ya existe',async()=>{
    const req={body:{nombre:'Alimentos'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    const error=new Error('Categoría duplicada')
    error.code='23505'
    service.crear.mockRejectedValue(error)
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'La categoría ya existe'
    })
  })
  it('crear responde 500 ante un error interno',async()=>{
    const req={body:{nombre:'Alimentos'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.crear.mockRejectedValue(new Error('DB error'))
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'Error al crear la categoría'
    })
  })
  it('actualizar responde 200 con la categoría actualizada',async()=>{
    const req={params:{id:1},body:{nombre:'Comida'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.actualizar.mockResolvedValue({id:1,nombre:'Comida'})
    await actualizar(req,res)
    expect(service.actualizar).toHaveBeenCalledWith(1,'Comida')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      ok:true,
      mensaje:'Categoría actualizada correctamente',
      categoria:{id:1,nombre:'Comida'}
    })
  })
  it('actualizar responde 404 si la categoría no existe',async()=>{
    const req={params:{id:99},body:{nombre:'Comida'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.actualizar.mockRejectedValue(new Error('Categoría no encontrada'))
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'Categoría no encontrada'
    })
  })
  it('actualizar responde 409 si la categoría ya existe',async()=>{
    const req={params:{id:1},body:{nombre:'Alimentos'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    const error=new Error('Categoría duplicada')
    error.code='23505'
    service.actualizar.mockRejectedValue(error)
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'La categoría ya existe'
    })
  })
  it('actualizar responde 500 ante un error interno',async()=>{
    const req={params:{id:1},body:{nombre:'Comida'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.actualizar.mockRejectedValue(new Error('DB error'))
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'Error al actualizar la categoría'
    })
  })
  it('eliminar responde 200 con la categoría eliminada',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.eliminar.mockResolvedValue({id:1,nombre:'Alimentos'})
    await eliminar(req,res)
    expect(service.eliminar).toHaveBeenCalledWith(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      ok:true,
      mensaje:'Categoría eliminada correctamente',
      categoria:{id:1,nombre:'Alimentos'}
    })
  })
  it('eliminar responde 404 si la categoría no existe',async()=>{
    const req={params:{id:99}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.eliminar.mockRejectedValue(new Error('Categoría no encontrada'))
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'Categoría no encontrada'
    })
  })
  it('eliminar responde 409 si tiene movimientos asociados',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    const error=new Error('Foreign key violation')
    error.code='23503'
    service.eliminar.mockRejectedValue(error)
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'No se puede eliminar la categoría porque tiene movimientos asociados'
    })
  })
  it('eliminar responde 500 ante un error interno',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.eliminar.mockRejectedValue(new Error('DB error'))
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      ok:false,
      mensaje:'Error al eliminar la categoría'
    })
  })
})
