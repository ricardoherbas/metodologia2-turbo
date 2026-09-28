const service=require('../services/aportes_metas.service')
const pool=require('../config/conexion-db')
jest.mock('../config/conexion-db')
describe('aportesMetasService',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('obtenerTodas devuelve todos los aportes',async()=>{
    pool.query.mockResolvedValue({
      rows:[
        {id:1,meta_id:1,monto:100,fecha:'2026-09-01',descripcion:'primer aporte'},
        {id:2,meta_id:1,monto:200,fecha:'2026-09-02',descripcion:'segundo aporte'}
      ]
    })
    const aportes=await service.obtenerTodas()
    expect(aportes).toHaveLength(2)
    expect(aportes[0].id).toBe(1)
    expect(aportes[1].id).toBe(2)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,meta_id,monto,fecha,descripcion,creado_en FROM aportes_metas ORDER BY fecha DESC,id DESC')
  })
  it('obtenerPorId devuelve el aporte existente',async()=>{
    pool.query.mockResolvedValue({
      rows:[
        {id:1,meta_id:1,monto:100,fecha:'2026-09-01',descripcion:'primer aporte'}
      ]
    })
    const aporte=await service.obtenerPorId(1)
    expect(aporte.id).toBe(1)
    expect(aporte.meta_id).toBe(1)
    expect(aporte.monto).toBe(100)
    expect(aporte.descripcion).toBe('primer aporte')
    expect(pool.query).toHaveBeenCalledWith('SELECT id,meta_id,monto,fecha,descripcion,creado_en FROM aportes_metas WHERE id=$1',[1])
  })
  it('obtenerPorId lanza error cuando el aporte no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.obtenerPorId(999)).rejects.toThrow('Aporte no encontrado')
  })
  it('obtenerPorMeta devuelve los aportes de una meta',async()=>{
    pool.query.mockResolvedValue({
      rows:[
        {id:2,meta_id:1,monto:200,fecha:'2026-09-02',descripcion:'segundo aporte'},
        {id:1,meta_id:1,monto:100,fecha:'2026-09-01',descripcion:'primer aporte'}
      ]
    })
    const aportes=await service.obtenerPorMeta(1)
    expect(aportes).toHaveLength(2)
    expect(aportes[0].meta_id).toBe(1)
    expect(aportes[1].meta_id).toBe(1)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,meta_id,monto,fecha,descripcion,creado_en FROM aportes_metas WHERE meta_id=$1 ORDER BY fecha DESC,id DESC',[1])
  })
  it('crear aporte devuelve objeto',async()=>{
    pool.query.mockResolvedValue({
      rows:[
        {id:1,meta_id:1,monto:100,descripcion:'primer aporte'}
      ]
    })
    const aporte=await service.crear(1,100,'primer aporte')
    expect(aporte.id).toBe(1)
    expect(aporte.meta_id).toBe(1)
    expect(aporte.monto).toBe(100)
    expect(aporte.descripcion).toBe('primer aporte')
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO aportes_metas(meta_id,monto,descripcion) VALUES($1,$2,$3) RETURNING id,meta_id,monto,fecha,descripcion,creado_en',[1,100,'primer aporte'])
  })
  it('crear aporte utiliza null cuando no se proporciona descripcion',async()=>{
    pool.query.mockResolvedValue({
      rows:[
        {id:1,meta_id:1,monto:100,descripcion:null}
      ]
    })
    const aporte=await service.crear(1,100)
    expect(aporte.descripcion).toBeNull()
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO aportes_metas(meta_id,monto,descripcion) VALUES($1,$2,$3) RETURNING id,meta_id,monto,fecha,descripcion,creado_en',[1,100,null])
  })
  it('actualizar devuelve el aporte actualizado',async()=>{
    pool.query.mockResolvedValue({
      rows:[
        {id:1,meta_id:2,monto:300,descripcion:'aporte actualizado'}
      ]
    })
    const aporte=await service.actualizar(1,2,300,'aporte actualizado')
    expect(aporte.id).toBe(1)
    expect(aporte.meta_id).toBe(2)
    expect(aporte.monto).toBe(300)
    expect(aporte.descripcion).toBe('aporte actualizado')
    expect(pool.query).toHaveBeenCalledWith('UPDATE aportes_metas SET meta_id=$1,monto=$2,descripcion=$3 WHERE id=$4 RETURNING id,meta_id,monto,fecha,descripcion,creado_en',[2,300,'aporte actualizado',1])
  })
  it('actualizar lanza error cuando el aporte no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.actualizar(999,2,300,'aporte actualizado')).rejects.toThrow('Aporte no encontrado')
  })
  it('eliminar devuelve el aporte eliminado',async()=>{
    pool.query.mockResolvedValue({
      rows:[
        {id:1,meta_id:1,monto:100,descripcion:'primer aporte'}
      ]
    })
    const aporte=await service.eliminar(1)
    expect(aporte.id).toBe(1)
    expect(aporte.meta_id).toBe(1)
    expect(aporte.monto).toBe(100)
    expect(aporte.descripcion).toBe('primer aporte')
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM aportes_metas WHERE id=$1 RETURNING id,meta_id,monto,fecha,descripcion,creado_en',[1])
  })
  it('eliminar lanza error cuando el aporte no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.eliminar(999)).rejects.toThrow('Aporte no encontrado')
  })
})

