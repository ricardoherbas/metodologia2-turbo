const usuariosService=require('../services/usuarios.service')
const pool=require('../config/conexion-db')
const bcrypt=require('bcrypt')
jest.mock('../config/conexion-db',()=>({
  query:jest.fn()
}))
jest.mock('bcrypt',()=>({
  hash:jest.fn()
}))
describe('usuariosService',()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
    bcrypt.hash.mockResolvedValue('hash_simulado')
  })
  test('obtenerTodas devuelve todos los usuarios',async()=>{
    const usuarios=[
      {id:2,nombre:'Ana',email:'ana@test.com',creado_en:'2026-09-18'},
      {id:1,nombre:'Ricardo',email:'ricardo@test.com',creado_en:'2026-09-17'}
    ]
    pool.query.mockResolvedValue({rows:usuarios})
    const resultado=await usuariosService.obtenerTodas()
    expect(resultado).toEqual(usuarios)
    expect(pool.query).toHaveBeenCalledTimes(1)
    expect(pool.query).toHaveBeenCalledWith('SELECT id,nombre,email,creado_en FROM usuarios ORDER BY id DESC')
  })
  test('obtenerPorId devuelve un usuario',async()=>{
    const usuario={id:1,nombre:'Ricardo',email:'test@test.com',creado_en:'2026-09-18'}
    pool.query.mockResolvedValue({rows:[usuario]})
    const resultado=await usuariosService.obtenerPorId(1)
    expect(resultado).toEqual(usuario)
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id,nombre,email,creado_en FROM usuarios WHERE id=$1',
      [1]
    )
  })
  test('obtenerPorId lanza error si el usuario no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(usuariosService.obtenerPorId(999)).rejects.toThrow('Usuario no encontrado')
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id,nombre,email,creado_en FROM usuarios WHERE id=$1',
      [999]
    )
  })
  test('obtenerPorEmail devuelve un usuario',async()=>{
    const usuario={
      id:1,
      nombre:'Ricardo',
      email:'test@test.com',
      password_hash:'hash_simulado',
      creado_en:'2026-09-18'
    }
    pool.query.mockResolvedValue({rows:[usuario]})
    const resultado=await usuariosService.obtenerPorEmail('test@test.com')
    expect(resultado).toEqual(usuario)
    expect(resultado.password_hash).toBe('hash_simulado')
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id,nombre,email,password_hash,creado_en FROM usuarios WHERE email=$1',
      ['test@test.com']
    )
  })
  test('obtenerPorEmail lanza error si el usuario no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(usuariosService.obtenerPorEmail('noexiste@test.com')).rejects.toThrow('Usuario no encontrado')
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id,nombre,email,password_hash,creado_en FROM usuarios WHERE email=$1',
      ['noexiste@test.com']
    )
  })
  test('crear el usuario y devuelve sus datos sin password_hash',async()=>{
    const usuario={
      id:1,
      nombre:'Ricardo',
      email:'test@test.com',
      creado_en:'2026-09-18'
    }
    pool.query.mockResolvedValue({rows:[usuario]})
    const resultado=await usuariosService.crear('Ricardo','test@test.com','1234')
    expect(resultado).toEqual(usuario)
    expect(resultado.password_hash).toBeUndefined()
    expect(bcrypt.hash).toHaveBeenCalledWith('1234',10)
    expect(pool.query).toHaveBeenCalledTimes(1)
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO usuarios(nombre,email,password_hash) VALUES($1,$2,$3) RETURNING id,nombre,email,creado_en',
      ['Ricardo','test@test.com','hash_simulado']
    )
  })
  test('crear propaga el error cuando el email ya existe',async()=>{
    pool.query.mockRejectedValue(
      new Error('duplicate key value violates unique constraint "usuarios_email_key"')
    )
    await expect(
      usuariosService.crear('Ricardo','test@test.com','1234')
    ).rejects.toThrow('duplicate key')
    expect(bcrypt.hash).toHaveBeenCalledWith('1234',10)
    expect(pool.query).toHaveBeenCalledTimes(1)
  })
  test('crear propaga un error de base de datos',async()=>{
    pool.query.mockRejectedValue(new Error('DB error'))
    await expect(
      usuariosService.crear('Ricardo','test@test.com','1234')
    ).rejects.toThrow('DB error')
  })
  test('actualizar usuario con nueva contraseña',async()=>{
    const usuario={
      id:1,
      nombre:'Ricardo actualizado',
      email:'nuevo@test.com',
      creado_en:'2026-09-18'
    }
    pool.query.mockResolvedValue({rows:[usuario]})
    const resultado=await usuariosService.actualizar(
      1,
      'Ricardo actualizado',
      'nuevo@test.com',
      'nueva123'
    )
    expect(resultado).toEqual(usuario)
    expect(bcrypt.hash).toHaveBeenCalledWith('nueva123',10)
    expect(pool.query).toHaveBeenCalledTimes(1)
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE usuarios SET nombre=$1,email=$2,password_hash=$3 WHERE id=$4 RETURNING id,nombre,email,creado_en',
      ['Ricardo actualizado','nuevo@test.com','hash_simulado',1]
    )
  })
  test('actualizar usuario sin cambiar contraseña',async()=>{
    const usuario={
      id:1,
      nombre:'Ricardo actualizado',
      email:'nuevo@test.com',
      creado_en:'2026-09-18'
    }
    pool.query.mockResolvedValue({rows:[usuario]})
    const resultado=await usuariosService.actualizar(
      1,
      'Ricardo actualizado',
      'nuevo@test.com'
    )
    expect(resultado).toEqual(usuario)
    expect(bcrypt.hash).not.toHaveBeenCalled()
    expect(pool.query).toHaveBeenCalledTimes(1)
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE usuarios SET nombre=$1,email=$2 WHERE id=$3 RETURNING id,nombre,email,creado_en',
      ['Ricardo actualizado','nuevo@test.com',1]
    )
  })
  test('actualizar lanza error si el usuario no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(
      usuariosService.actualizar(
        999,
        'Ricardo',
        'test@test.com'
      )
    ).rejects.toThrow('Usuario no encontrado')
    expect(pool.query).toHaveBeenCalledTimes(1)
  })
  test('eliminar usuario devuelve el usuario eliminado',async()=>{
    const usuario={
      id:1,
      nombre:'Ricardo',
      email:'test@test.com',
      creado_en:'2026-09-18'
    }
    pool.query.mockResolvedValue({rows:[usuario]})
    const resultado=await usuariosService.eliminar(1)
    expect(resultado).toEqual(usuario)
    expect(pool.query).toHaveBeenCalledTimes(1)
    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM usuarios WHERE id=$1 RETURNING id,nombre,email,creado_en',
      [1]
    )
  })
  test('eliminar lanza error si el usuario no existe',async()=>{
    pool.query.mockResolvedValue({rows:[]})
    await expect(usuariosService.eliminar(999)).rejects.toThrow('Usuario no encontrado')
    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM usuarios WHERE id=$1 RETURNING id,nombre,email,creado_en',
      [999]
    )
  })
  test('eliminar propaga un error de base de datos',async()=>{
    pool.query.mockRejectedValue(new Error('DB error'))
    await expect(
      usuariosService.eliminar(1)
    ).rejects.toThrow('DB error')
  })
})
