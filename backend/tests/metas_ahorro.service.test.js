jest.mock('../config/conexion-db',()=>({query:jest.fn()}))
const pool=require('../config/conexion-db')
const service=require('../services/metas_ahorro.service')
describe('metasAhorroService',()=>{
  beforeEach(()=>jest.clearAllMocks())
  it('obtenerTodas devuelve todas las metas',async()=>{
    const metas=[{id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:'2026-12-31',creado_en:'2026-01-01'}]
    pool.query.mockResolvedValue({rows:metas})
    const resultado=await service.obtenerTodas()
    expect(resultado).toEqual(metas)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en FROM metas_ahorro ORDER BY id DESC')
  })
  it('obtenerPorId devuelve una meta',async()=>{
    const meta={id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:'2026-12-31',creado_en:'2026-01-01'}
    pool.query.mockResolvedValue({rows:[meta]})
    const resultado=await service.obtenerPorId(1)
    expect(resultado).toEqual(meta)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en FROM metas_ahorro WHERE id=$1',[1])
  })
  it('obtenerPorId lanza error si la meta no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.obtenerPorId(999)).rejects.toThrow('Meta no encontrada')
  })
  it('obtenerPorUsuario devuelve las metas del usuario',async()=>{
    const metas=[{id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:'2026-12-31',creado_en:'2026-01-01'}]
    pool.query.mockResolvedValue({rows:metas})
    const resultado=await service.obtenerPorUsuario(1)
    expect(resultado).toEqual(metas)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en FROM metas_ahorro WHERE usuario_id=$1 ORDER BY id DESC',[1])
  })
  it('crear devuelve la meta creada',async()=>{
    const meta={id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:'2026-12-31',creado_en:'2026-01-01'}
    pool.query.mockResolvedValue({rows:[meta]})
    const resultado=await service.crear(1,'Viaje',1000,200,'en proceso','2026-12-31')
    expect(resultado).toEqual(meta)
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO metas_ahorro(usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite) VALUES($1,$2,$3,COALESCE($4,0.00),COALESCE($5,\'en proceso\'),$6) RETURNING id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en',[1,'Viaje',1000,200,'en proceso','2026-12-31'])
  })
  it('crear usa null cuando no se envia fecha_limite',async()=>{
    const meta={id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:0,estado:'en proceso',fecha_limite:null,creado_en:'2026-01-01'}
    pool.query.mockResolvedValue({rows:[meta]})
    await service.crear(1,'Viaje',1000,undefined,undefined,undefined)
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO metas_ahorro(usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite) VALUES($1,$2,$3,COALESCE($4,0.00),COALESCE($5,\'en proceso\'),$6) RETURNING id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en',[1,'Viaje',1000,undefined,undefined,null])
  })
  it('crear propaga el error de la DB',async()=>{
    pool.query.mockRejectedValue(new Error('DB error'))
    await expect(service.crear(1,'Viaje',1000,200,'en proceso','2026-12-31')).rejects.toThrow('DB error')
  })
  it('actualizar devuelve la meta actualizada',async()=>{
    const meta={id:1,usuario_id:1,nombre:'Viaje actualizado',monto_objetivo:1500,monto_actual:500,estado:'en proceso',fecha_limite:'2026-12-31',creado_en:'2026-01-01'}
    pool.query.mockResolvedValue({rows:[meta]})
    const resultado=await service.actualizar(1,1,'Viaje actualizado',1500,500,'en proceso','2026-12-31')
    expect(resultado).toEqual(meta)
    expect(pool.query).toHaveBeenCalledWith('UPDATE metas_ahorro SET usuario_id=$1,nombre=$2,monto_objetivo=$3,monto_actual=$4,estado=$5,fecha_limite=$6 WHERE id=$7 RETURNING id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en',[1,'Viaje actualizado',1500,500,'en proceso','2026-12-31',1])
  })
  it('actualizar lanza error si la meta no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.actualizar(999,1,'Viaje',1000,200,'en proceso',null)).rejects.toThrow('Meta no encontrada')
    expect(pool.query).toHaveBeenCalledWith('UPDATE metas_ahorro SET usuario_id=$1,nombre=$2,monto_objetivo=$3,monto_actual=$4,estado=$5,fecha_limite=$6 WHERE id=$7 RETURNING id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en',[1,'Viaje',1000,200,'en proceso',null,999])
  })
  it('eliminar devuelve la meta eliminada',async()=>{
    const meta={id:1,usuario_id:1,nombre:'Viaje',monto_objetivo:1000,monto_actual:200,estado:'en proceso',fecha_limite:null,creado_en:'2026-01-01'}
    pool.query.mockResolvedValue({rows:[meta]})
    const resultado=await service.eliminar(1)
    expect(resultado).toEqual(meta)
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM metas_ahorro WHERE id=$1 RETURNING id,usuario_id,nombre,monto_objetivo,monto_actual,estado,fecha_limite,creado_en',[1])
  })
  it('eliminar lanza error si la meta no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.eliminar(999)).rejects.toThrow('Meta no encontrada')
  })
  it('eliminar propaga el error de la DB',async()=>{
    pool.query.mockRejectedValue(new Error('DB error'))
    await expect(service.eliminar(1)).rejects.toThrow('DB error')
  })
})
