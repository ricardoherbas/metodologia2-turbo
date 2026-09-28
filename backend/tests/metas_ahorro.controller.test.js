const {obtenerTodas,obtenerPorId,obtenerPorUsuario,crear,actualizar,eliminar}=require('../controllers/metas_ahorro.controller')
const service=require('../services/metas_ahorro.service')
jest.mock('../services/metas_ahorro.service')
describe('metasAhorroController',()=>{
  let res
  beforeEach(()=>{
    jest.clearAllMocks()
    res={status:jest.fn().mockReturnThis(),json:jest.fn()}
  })
  it('obtenerTodas responde 200 con las metas',async()=>{
    const metas=[
      {id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso'},
      {id:2,usuario_id:1,nombre:'Casa',monto_objetivo:5000,monto_actual:1000,estado:'en proceso'}
    ]
    service.obtenerTodas.mockResolvedValue(metas)
    await obtenerTodas({},res)
    expect(service.obtenerTodas).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,metas})
  })
  it('obtenerTodas responde 500 si ocurre un error',async()=>{
    service.obtenerTodas.mockRejectedValue(new Error('DB error'))
    await obtenerTodas({},res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener las metas'})
  })
  it('obtenerPorId responde 200 con la meta',async()=>{
    const req={params:{id:'1'}}
    const meta={id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso'}
    service.obtenerPorId.mockResolvedValue(meta)
    await obtenerPorId(req,res)
    expect(service.obtenerPorId).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,meta})
  })
  it('obtenerPorId responde 404 si la meta no existe',async()=>{
    const req={params:{id:'999'}}
    service.obtenerPorId.mockRejectedValue(new Error('Meta no encontrada'))
    await obtenerPorId(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Meta no encontrada'})
  })
  it('obtenerPorId responde 500 si ocurre un error',async()=>{
    const req={params:{id:'1'}}
    service.obtenerPorId.mockRejectedValue(new Error('DB error'))
    await obtenerPorId(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener la meta'})
  })
  it('obtenerPorUsuario responde 200 con las metas del usuario',async()=>{
    const req={params:{usuario_id:'1'}}
    const metas=[
      {id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso'}
    ]
    service.obtenerPorUsuario.mockResolvedValue(metas)
    await obtenerPorUsuario(req,res)
    expect(service.obtenerPorUsuario).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,metas})
  })
  it('obtenerPorUsuario responde 500 si ocurre un error',async()=>{
    const req={params:{usuario_id:'1'}}
    service.obtenerPorUsuario.mockRejectedValue(new Error('DB error'))
    await obtenerPorUsuario(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener las metas del usuario'})
  })
  it('crear responde 201 con meta',async()=>{
    const req={body:{usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:null}}
    const meta={id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso'}
    service.crear.mockResolvedValue(meta)
    await crear(req,res)
    expect(service.crear).toHaveBeenCalledWith(1,'Viaje',1000,200,'en proceso',null)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Meta creada correctamente',meta})
  })
  it('crear responde 404 si el usuario no existe',async()=>{
    const req={body:{usuario_id:999,nombre:'Viaje',monto_objetivo:1000,monto_actual:0,estado:'en proceso',fecha_limite:null}}
    const error=new Error('Foreign key error')
    error.code='23503'
    service.crear.mockRejectedValue(error)
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'El usuario no existe'})
  })
  it('crear responde 500 si ocurre un error',async()=>{
    const req={body:{usuario_id:1,nombre:'Viaje',monto_objetivo:1000}}
    service.crear.mockRejectedValue(new Error('DB error'))
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al crear la meta'})
  })
  it('actualizar responde 200 con la meta actualizada',async()=>{
    const req={
      params:{id:'1'},
      body:{usuario_id:1,nombre:'Viaje actualizado',monto_objetivo:1500,monto_actual:500,estado:'en proceso',fecha_limite:'2026-12-31'}
    }
    const meta={id:1,usuario_id:1,nombre:'Viaje actualizado',monto_objetivo:1500,monto_actual:500,estado:'en proceso',fecha_limite:'2026-12-31'}
    service.actualizar.mockResolvedValue(meta)
    await actualizar(req,res)
    expect(service.actualizar).toHaveBeenCalledWith('1',1,'Viaje actualizado',1500,500,'en proceso','2026-12-31')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Meta actualizada correctamente',meta})
  })
  it('actualizar responde 404 si la meta no existe',async()=>{
    const req={
      params:{id:'999'},
      body:{usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:null}
    }
    service.actualizar.mockRejectedValue(new Error('Meta no encontrada'))
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Meta no encontrada'})
  })
  it('actualizar responde 404 si el usuario no existe',async()=>{
    const req={
      params:{id:'1'},
      body:{usuario_id:999,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:null}
    }
    const error=new Error('Foreign key error')
    error.code='23503'
    service.actualizar.mockRejectedValue(error)
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'El usuario no existe'})
  })
  it('actualizar responde 500 si ocurre un error',async()=>{
    const req={
      params:{id:'1'},
      body:{usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:null}
    }
    service.actualizar.mockRejectedValue(new Error('DB error'))
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al actualizar la meta'})
  })
  it('eliminar responde 200 con la meta eliminada',async()=>{
    const req={params:{id:'1'}}
    const meta={id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso'}
    service.eliminar.mockResolvedValue(meta)
    await eliminar(req,res)
    expect(service.eliminar).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Meta eliminada correctamente',meta})
  })
  it('eliminar responde 404 si la meta no existe',async()=>{
    const req={params:{id:'999'}}
    service.eliminar.mockRejectedValue(new Error('Meta no encontrada'))
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Meta no encontrada'})
  })
  it('eliminar responde 500 si ocurre un error',async()=>{
    const req={params:{id:'1'}}
    service.eliminar.mockRejectedValue(new Error('DB error'))
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al eliminar la meta'})
  })
})
