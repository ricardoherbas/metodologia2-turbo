jest.mock('../config/conexion-db',()=>({query:jest.fn()}))
const pool=require('../config/conexion-db')
const service=require('../services/movimientos.service')
describe('movimientosService',()=>{
  beforeEach(()=>jest.clearAllMocks())
  it('obtenerTodas devuelve todos los movimientos',async()=>{
    const movimientos=[{id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:500,descripcion:'comida',fecha:'2026-09-01',creado_en:'2026-09-01'}]
    pool.query.mockResolvedValue({rows:movimientos})
    const resultado=await service.obtenerTodas()
    expect(resultado).toEqual(movimientos)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en FROM movimientos ORDER BY fecha DESC,id DESC')
  })
  it('obtenerPorId devuelve un movimiento',async()=>{
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:500,descripcion:'comida',fecha:'2026-09-01',creado_en:'2026-09-01'}
    pool.query.mockResolvedValue({rows:[movimiento]})
    const resultado=await service.obtenerPorId(1)
    expect(resultado).toEqual(movimiento)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en FROM movimientos WHERE id=$1',[1])
  })
  it('obtenerPorId lanza error si el movimiento no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.obtenerPorId(999)).rejects.toThrow('Movimiento no encontrado')
  })
  it('obtenerPorUsuario devuelve los movimientos del usuario',async()=>{
    const movimientos=[{id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:500,descripcion:'comida',fecha:'2026-09-01',creado_en:'2026-09-01'}]
    pool.query.mockResolvedValue({rows:movimientos})
    const resultado=await service.obtenerPorUsuario(1)
    expect(resultado).toEqual(movimientos)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en FROM movimientos WHERE usuario_id=$1 ORDER BY fecha DESC,id DESC',[1])
  })
  it('obtenerPorCategoria devuelve los movimientos de la categoria',async()=>{
    const movimientos=[{id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:500,descripcion:'comida',fecha:'2026-09-01',creado_en:'2026-09-01'}]
    pool.query.mockResolvedValue({rows:movimientos})
    const resultado=await service.obtenerPorCategoria(2)
    expect(resultado).toEqual(movimientos)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en FROM movimientos WHERE categoria_id=$1 ORDER BY fecha DESC,id DESC',[2])
  })
  it('crear devuelve el movimiento creado',async()=>{
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:500,descripcion:'comida',fecha:'2026-09-01',creado_en:'2026-09-01'}
    pool.query.mockResolvedValue({rows:[movimiento]})
    const resultado=await service.crear(1,2,'gasto',500,'comida','2026-09-01')
    expect(resultado).toEqual(movimiento)
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO movimientos(usuario_id,categoria_id,tipo,monto,descripcion,fecha) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[1,2,'gasto',500,'comida','2026-09-01'])
  })
  it('crear usa null cuando no se envia descripcion',async()=>{
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:500,descripcion:null,fecha:'2026-09-01',creado_en:'2026-09-01'}
    pool.query.mockResolvedValue({rows:[movimiento]})
    await service.crear(1,2,'gasto',500,undefined,'2026-09-01')
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO movimientos(usuario_id,categoria_id,tipo,monto,descripcion,fecha) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[1,2,'gasto',500,null,'2026-09-01'])
  })
  it('crear propaga el error de la DB',async()=>{
    pool.query.mockRejectedValue(new Error('DB error'))
    await expect(service.crear(1,2,'gasto',500,'comida','2026-09-01')).rejects.toThrow('DB error')
  })
  it('actualizar devuelve el movimiento actualizado',async()=>{
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:750,descripcion:'compra actualizada',fecha:'2026-09-03',creado_en:'2026-09-01'}
    pool.query.mockResolvedValue({rows:[movimiento]})
    const resultado=await service.actualizar(1,1,2,'gasto',750,'compra actualizada','2026-09-03')
    expect(resultado).toEqual(movimiento)
    expect(pool.query).toHaveBeenCalledWith('UPDATE movimientos SET usuario_id=$1,categoria_id=$2,tipo=$3,monto=$4,descripcion=$5,fecha=$6 WHERE id=$7 RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[1,2,'gasto',750,'compra actualizada','2026-09-03',1])
  })
  it('actualizar usa null cuando no se envia descripcion',async()=>{
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:750,descripcion:null,fecha:'2026-09-03',creado_en:'2026-09-01'}
    pool.query.mockResolvedValue({rows:[movimiento]})
    await service.actualizar(1,1,2,'gasto',750,undefined,'2026-09-03')
    expect(pool.query).toHaveBeenCalledWith('UPDATE movimientos SET usuario_id=$1,categoria_id=$2,tipo=$3,monto=$4,descripcion=$5,fecha=$6 WHERE id=$7 RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[1,2,'gasto',750,null,'2026-09-03',1])
  })
  it('actualizar lanza error si el movimiento no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.actualizar(999,1,2,'gasto',750,'compra','2026-09-03')).rejects.toThrow('Movimiento no encontrado')
    expect(pool.query).toHaveBeenCalledWith('UPDATE movimientos SET usuario_id=$1,categoria_id=$2,tipo=$3,monto=$4,descripcion=$5,fecha=$6 WHERE id=$7 RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[1,2,'gasto',750,'compra','2026-09-03',999])
  })
  it('eliminar devuelve el movimiento eliminado',async()=>{
    const movimiento={id:1,usuario_id:1,categoria_id:2,tipo:'gasto',monto:500,descripcion:'comida',fecha:'2026-09-01',creado_en:'2026-09-01'}
    pool.query.mockResolvedValue({rows:[movimiento]})
    const resultado=await service.eliminar(1)
    expect(resultado).toEqual(movimiento)
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM movimientos WHERE id=$1 RETURNING id,usuario_id,categoria_id,tipo,monto,descripcion,fecha,creado_en',[1])
  })
  it('eliminar lanza error si el movimiento no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.eliminar(999)).rejects.toThrow('Movimiento no encontrado')
  })
  it('eliminar propaga el error de la DB',async()=>{
    pool.query.mockRejectedValue(new Error('DB error'))
    await expect(service.eliminar(1)).rejects.toThrow('DB error')
  })
})
