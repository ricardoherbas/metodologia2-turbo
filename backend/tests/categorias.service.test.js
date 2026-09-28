const service=require('../services/categorias.service')
const pool=require('../config/conexion-db')
jest.mock('../config/conexion-db')
describe('categoriasService',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  it('obtenerTodas devuelve todas las categorías',async()=>{
    pool.query.mockResolvedValue({
      rows:[
        {id:1,nombre:'Alimentos'},
        {id:2,nombre:'Transporte'}
      ]
    })
    const categorias=await service.obtenerTodas()
    expect(categorias).toEqual([
      {id:1,nombre:'Alimentos'},
      {id:2,nombre:'Transporte'}
    ])
    expect(pool.query).toHaveBeenCalledWith('SELECT id,nombre FROM categorias ORDER BY nombre ASC')
  })
  it('obtenerPorId devuelve una categoría',async()=>{
    pool.query.mockResolvedValue({
      rows:[{id:1,nombre:'Alimentos'}]
    })
    const categoria=await service.obtenerPorId(1)
    expect(categoria).toEqual({id:1,nombre:'Alimentos'})
    expect(pool.query).toHaveBeenCalledWith('SELECT id,nombre FROM categorias WHERE id=$1',[1])
  })
  it('obtenerPorId lanza error si la categoría no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.obtenerPorId(99)).rejects.toThrow('Categoría no encontrada')
    expect(pool.query).toHaveBeenCalledWith('SELECT id,nombre FROM categorias WHERE id=$1',[99])
  })
  it('crear devuelve la categoría creada',async()=>{
    pool.query.mockResolvedValue({
      rows:[{id:1,nombre:'Alimentos'}]
    })
    const categoria=await service.crear('Alimentos')
    expect(categoria).toEqual({id:1,nombre:'Alimentos'})
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO categorias(nombre) VALUES($1) RETURNING id,nombre',
      ['Alimentos']
    )
  })
  it('crear propaga el error de la DB',async()=>{
    pool.query.mockRejectedValue(new Error('DB error'))
    await expect(service.crear('Alimentos')).rejects.toThrow('DB error')
  })
  it('actualizar devuelve la categoría actualizada',async()=>{
    pool.query.mockResolvedValue({
      rows:[{id:1,nombre:'Comida'}]
    })
    const categoria=await service.actualizar(1,'Comida')
    expect(categoria).toEqual({id:1,nombre:'Comida'})
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE categorias SET nombre=$1 WHERE id=$2 RETURNING id,nombre',
      ['Comida',1]
    )
  })
  it('actualizar lanza error si la categoría no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.actualizar(99,'Comida')).rejects.toThrow('Categoría no encontrada')
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE categorias SET nombre=$1 WHERE id=$2 RETURNING id,nombre',
      ['Comida',99]
    )
  })
  it('eliminar devuelve la categoría eliminada',async()=>{
    pool.query.mockResolvedValue({
      rows:[{id:1,nombre:'Alimentos'}]
    })
    const categoria=await service.eliminar(1)
    expect(categoria).toEqual({id:1,nombre:'Alimentos'})
    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM categorias WHERE id=$1 RETURNING id,nombre',
      [1]
    )
  })
  it('eliminar lanza error si la categoría no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(service.eliminar(99)).rejects.toThrow('Categoría no encontrada')
    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM categorias WHERE id=$1 RETURNING id,nombre',
      [99]
    )
  })
})
