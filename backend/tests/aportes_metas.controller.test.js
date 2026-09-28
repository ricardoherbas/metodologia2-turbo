const {obtenerTodas,obtenerPorId,obtenerPorMeta,crear,actualizar,eliminar}=require('../controllers/aportes_metas.controller')
const service=require('../services/aportes_metas.service')
jest.mock('../services/aportes_metas.service')
describe('aportesMetasController',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('obtenerTodas responde 200 con los aportes',async()=>{
    const req={}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerTodas.mockResolvedValue([{id:1,meta_id:1,monto:100}])
    await obtenerTodas(req,res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,aportes:[{id:1,meta_id:1,monto:100}]})
  })
  it('obtenerTodas responde 500 cuando ocurre un error',async()=>{
    const req={}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerTodas.mockRejectedValue(new Error('Error de base de datos'))
    await obtenerTodas(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener los aportes'})
  })
  it('obtenerPorId responde 200 con el aporte',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerPorId.mockResolvedValue({id:1,monto:100})
    await obtenerPorId(req,res)
    expect(service.obtenerPorId).toHaveBeenCalledWith(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,aporte:{id:1,monto:100}})
  })
  it('obtenerPorId responde 404 cuando el aporte no existe',async()=>{
    const req={params:{id:999}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerPorId.mockRejectedValue(new Error('Aporte no encontrado'))
    await obtenerPorId(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Aporte no encontrado'})
  })
  it('obtenerPorId responde 500 cuando ocurre un error',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerPorId.mockRejectedValue(new Error('Error de base de datos'))
    await obtenerPorId(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener el aporte'})
  })
  it('obtenerPorMeta responde 200 con los aportes de la meta',async()=>{
    const req={params:{meta_id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerPorMeta.mockResolvedValue([{id:1,meta_id:1,monto:100}])
    await obtenerPorMeta(req,res)
    expect(service.obtenerPorMeta).toHaveBeenCalledWith(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,aportes:[{id:1,meta_id:1,monto:100}]})
  })
  it('obtenerPorMeta responde 500 cuando ocurre un error',async()=>{
    const req={params:{meta_id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.obtenerPorMeta.mockRejectedValue(new Error('Error de base de datos'))
    await obtenerPorMeta(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener los aportes de la meta'})
  })
  it('crear responde 201 con el aporte creado',async()=>{
    const req={body:{meta_id:1,monto:100,descripcion:'primer aporte'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.crear.mockResolvedValue({id:1,meta_id:1,monto:100,descripcion:'primer aporte'})
    await crear(req,res)
    expect(service.crear).toHaveBeenCalledWith(1,100,'primer aporte')
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Aporte creado correctamente',aporte:{id:1,meta_id:1,monto:100,descripcion:'primer aporte'}})
  })
  it('crear responde 404 cuando la meta no existe',async()=>{
    const req={body:{meta_id:999,monto:100,descripcion:'primer aporte'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    const error=new Error('Foreign key error')
    error.code='23503'
    service.crear.mockRejectedValue(error)
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'La meta de ahorro no existe'})
  })
  it('crear responde 500 cuando ocurre un error',async()=>{
    const req={body:{meta_id:1,monto:100,descripcion:'primer aporte'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.crear.mockRejectedValue(new Error('Error de base de datos'))
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al crear el aporte'})
  })
  it('actualizar responde 200 con el aporte actualizado',async()=>{
    const req={params:{id:1},body:{meta_id:2,monto:300,descripcion:'aporte actualizado'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.actualizar.mockResolvedValue({id:1,meta_id:2,monto:300,descripcion:'aporte actualizado'})
    await actualizar(req,res)
    expect(service.actualizar).toHaveBeenCalledWith(1,2,300,'aporte actualizado')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Aporte actualizado correctamente',aporte:{id:1,meta_id:2,monto:300,descripcion:'aporte actualizado'}})
  })
  it('actualizar responde 404 cuando el aporte no existe',async()=>{
    const req={params:{id:999},body:{meta_id:2,monto:300,descripcion:'aporte actualizado'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.actualizar.mockRejectedValue(new Error('Aporte no encontrado'))
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Aporte no encontrado'})
  })
  it('actualizar responde 404 cuando la meta no existe',async()=>{
    const req={params:{id:1},body:{meta_id:999,monto:300,descripcion:'aporte actualizado'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    const error=new Error('Foreign key error')
    error.code='23503'
    service.actualizar.mockRejectedValue(error)
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'La meta de ahorro no existe'})
  })
  it('actualizar responde 500 cuando ocurre un error',async()=>{
    const req={params:{id:1},body:{meta_id:2,monto:300,descripcion:'aporte actualizado'}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.actualizar.mockRejectedValue(new Error('Error de base de datos'))
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al actualizar el aporte'})
  })
  it('eliminar responde 200 con el aporte eliminado',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.eliminar.mockResolvedValue({id:1,meta_id:1,monto:100,descripcion:'primer aporte'})
    await eliminar(req,res)
    expect(service.eliminar).toHaveBeenCalledWith(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Aporte eliminado correctamente',aporte:{id:1,meta_id:1,monto:100,descripcion:'primer aporte'}})
  })
  it('eliminar responde 404 cuando el aporte no existe',async()=>{
    const req={params:{id:999}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.eliminar.mockRejectedValue(new Error('Aporte no encontrado'))
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Aporte no encontrado'})
  })
  it('eliminar responde 500 cuando ocurre un error',async()=>{
    const req={params:{id:1}}
    const res={status:jest.fn().mockReturnThis(),json:jest.fn()}
    service.eliminar.mockRejectedValue(new Error('Error de base de datos'))
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al eliminar el aporte'})
  })
})
