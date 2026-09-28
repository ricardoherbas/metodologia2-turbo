const {obtenerTodas,obtenerPorId,obtenerPorUsuario,obtenerPorCategoria,crear,actualizar,eliminar}=require('../controllers/movimientos.controller')
const service=require('../services/movimientos.service')
jest.mock('../services/movimientos.service')
describe('movimientosController',()=>{
  let res
  beforeEach(()=>{
    jest.clearAllMocks()
    res={status:jest.fn().mockReturnThis(),json:jest.fn()}
  })
  it('obtenerTodas responde 200 con los movimientos',async()=>{
    const movimientos=[
      {id:1,usuario_id:1,categoria_id:2,tipo:'ingreso',monto:500},
      {id:2,usuario_id:1,categoria_id:1,tipo:'gasto',monto:200}
    ]
    service.obtenerTodas.mockResolvedValue(movimientos)
    await obtenerTodas({},res)
    expect(service.obtenerTodas).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,movimientos})
  })
  it('obtenerTodas responde 500 si ocurre un error',async()=>{
    service.obtenerTodas.mockRejectedValue(new Error('DB error'))
    await obtenerTodas({},res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener los movimientos'})
  })
  it('obtenerPorId responde 200 con el movimiento',async()=>{
    const req={params:{id:'1'}}
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'ingreso',monto:500}
    service.obtenerPorId.mockResolvedValue(movimiento)
    await obtenerPorId(req,res)
    expect(service.obtenerPorId).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,movimiento})
  })
  it('obtenerPorId responde 404 si el movimiento no existe',async()=>{
    const req={params:{id:'999'}}
    service.obtenerPorId.mockRejectedValue(new Error('Movimiento no encontrado'))
    await obtenerPorId(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Movimiento no encontrado'})
  })
  it('obtenerPorId responde 500 si ocurre un error',async()=>{
    const req={params:{id:'1'}}
    service.obtenerPorId.mockRejectedValue(new Error('DB error'))
    await obtenerPorId(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener el movimiento'})
  })
  it('obtenerPorUsuario responde 200 con los movimientos del usuario',async()=>{
    const req={params:{usuario_id:'1'}}
    const movimientos=[
      {id:1,usuario_id:1,categoria_id:2,tipo:'ingreso',monto:500}
    ]
    service.obtenerPorUsuario.mockResolvedValue(movimientos)
    await obtenerPorUsuario(req,res)
    expect(service.obtenerPorUsuario).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,movimientos})
  })
  it('obtenerPorUsuario responde 500 si ocurre un error',async()=>{
    const req={params:{usuario_id:'1'}}
    service.obtenerPorUsuario.mockRejectedValue(new Error('DB error'))
    await obtenerPorUsuario(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener los movimientos del usuario'})
  })
  it('obtenerPorCategoria responde 200 con los movimientos de la categoria',async()=>{
    const req={params:{categoria_id:'2'}}
    const movimientos=[
      {id:1,usuario_id:1,categoria_id:2,tipo:'ingreso',monto:500}
    ]
    service.obtenerPorCategoria.mockResolvedValue(movimientos)
    await obtenerPorCategoria(req,res)
    expect(service.obtenerPorCategoria).toHaveBeenCalledWith('2')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,movimientos})
  })
  it('obtenerPorCategoria responde 500 si ocurre un error',async()=>{
    const req={params:{categoria_id:'2'}}
    service.obtenerPorCategoria.mockRejectedValue(new Error('DB error'))
    await obtenerPorCategoria(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al obtener los movimientos de la categoría'})
  })
  it('crear responde 201 con movimiento',async()=>{
    const req={body:{usuario_id:1,categoria_id:2,tipo:'ingreso',monto:500,descripcion:'sueldo',fecha:'2026-09-01'}}
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'ingreso',monto:500,descripcion:'sueldo',fecha:'2026-09-01'}
    service.crear.mockResolvedValue(movimiento)
    await crear(req,res)
    expect(service.crear).toHaveBeenCalledWith(1,2,'ingreso',500,'sueldo','2026-09-01')
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Movimiento creado correctamente',movimiento})
  })
  it('crear responde 404 si no existe el usuario',async()=>{
    const req={body:{usuario_id:999,categoria_id:2,tipo:'ingreso',monto:500}}
    const error=new Error('Foreign key error')
    error.code='23503'
    error.constraint='movimientos_usuario_id_fkey'
    service.crear.mockRejectedValue(error)
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'El usuario no existe'})
  })
  it('crear responde 404 si no existe la categoria',async()=>{
    const req={body:{usuario_id:1,categoria_id:999,tipo:'ingreso',monto:500}}
    const error=new Error('Foreign key error')
    error.code='23503'
    error.constraint='movimientos_categoria_id_fkey'
    service.crear.mockRejectedValue(error)
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'La categoría no existe'})
  })
  it('crear responde 404 si la FK no identifica usuario o categoria',async()=>{
    const req={body:{usuario_id:999,categoria_id:999,tipo:'ingreso',monto:500}}
    const error=new Error('Foreign key error')
    error.code='23503'
    error.constraint='otra_constraint'
    service.crear.mockRejectedValue(error)
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'El usuario o la categoría no existen'})
  })
  it('crear responde 400 si el tipo es inválido',async()=>{
    const req={body:{usuario_id:1,categoria_id:2,tipo:'ahorro',monto:500}}
    const error=new Error('Check constraint error')
    error.code='23514'
    service.crear.mockRejectedValue(error)
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'El tipo debe ser "gasto" o "ingreso"'})
  })
  it('crear responde 500 si ocurre un error',async()=>{
    const req={body:{usuario_id:1,categoria_id:2,tipo:'ingreso',monto:500}}
    service.crear.mockRejectedValue(new Error('DB error'))
    await crear(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al crear el movimiento'})
  })
  it('actualizar responde 200 con el movimiento actualizado',async()=>{
    const req={
      params:{id:'1'},
      body:{usuario_id:1,categoria_id:2,tipo:'gasto',monto:750,descripcion:'compra actualizada',fecha:'2026-09-03'}
    }
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:750,descripcion:'compra actualizada',fecha:'2026-09-03'}
    service.actualizar.mockResolvedValue(movimiento)
    await actualizar(req,res)
    expect(service.actualizar).toHaveBeenCalledWith('1',1,2,'gasto',750,'compra actualizada','2026-09-03')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Movimiento actualizado correctamente',movimiento})
  })
  it('actualizar responde 404 si el movimiento no existe',async()=>{
    const req={params:{id:'999'},body:{usuario_id:1,categoria_id:2,tipo:'gasto',monto:500}}
    service.actualizar.mockRejectedValue(new Error('Movimiento no encontrado'))
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Movimiento no encontrado'})
  })
  it('actualizar responde 404 si no existe el usuario',async()=>{
    const req={params:{id:'1'},body:{usuario_id:999,categoria_id:2,tipo:'gasto',monto:500}}
    const error=new Error('Foreign key error')
    error.code='23503'
    error.constraint='movimientos_usuario_id_fkey'
    service.actualizar.mockRejectedValue(error)
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'El usuario no existe'})
  })
  it('actualizar responde 404 si no existe la categoria',async()=>{
    const req={params:{id:'1'},body:{usuario_id:1,categoria_id:999,tipo:'gasto',monto:500}}
    const error=new Error('Foreign key error')
    error.code='23503'
    error.constraint='movimientos_categoria_id_fkey'
    service.actualizar.mockRejectedValue(error)
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'La categoría no existe'})
  })
  it('actualizar responde 404 si la FK no identifica usuario o categoria',async()=>{
    const req={params:{id:'1'},body:{usuario_id:999,categoria_id:999,tipo:'gasto',monto:500}}
    const error=new Error('Foreign key error')
    error.code='23503'
    error.constraint='otra_constraint'
    service.actualizar.mockRejectedValue(error)
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'El usuario o la categoría no existen'})
  })
  it('actualizar responde 400 si el tipo es inválido',async()=>{
    const req={params:{id:'1'},body:{usuario_id:1,categoria_id:2,tipo:'ahorro',monto:500}}
    const error=new Error('Check constraint error')
    error.code='23514'
    service.actualizar.mockRejectedValue(error)
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'El tipo debe ser "gasto" o "ingreso"'})
  })
  it('actualizar responde 500 si ocurre un error',async()=>{
    const req={params:{id:'1'},body:{usuario_id:1,categoria_id:2,tipo:'gasto',monto:500}}
    service.actualizar.mockRejectedValue(new Error('DB error'))
    await actualizar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al actualizar el movimiento'})
  })
  it('eliminar responde 200 con el movimiento eliminado',async()=>{
    const req={params:{id:'1'}}
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:500,descripcion:'comida'}
    service.eliminar.mockResolvedValue(movimiento)
    await eliminar(req,res)
    expect(service.eliminar).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true,mensaje:'Movimiento eliminado correctamente',movimiento})
  })
  it('eliminar responde 404 si el movimiento no existe',async()=>{
    const req={params:{id:'999'}}
    service.eliminar.mockRejectedValue(new Error('Movimiento no encontrado'))
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Movimiento no encontrado'})
  })
  it('eliminar responde 500 si ocurre un error',async()=>{
    const req={params:{id:'1'}}
    service.eliminar.mockRejectedValue(new Error('DB error'))
    await eliminar(req,res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ok:false,mensaje:'Error al eliminar el movimiento'})
  })
})
