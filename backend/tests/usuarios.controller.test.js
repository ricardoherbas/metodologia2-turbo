const usuariosController=require('../controllers/usuarios.controller')
const service=require('../services/usuarios.service')
jest.mock('../services/usuarios.service')
describe('usuariosController',()=>{
  const crearRes=()=>{
    return {status:jest.fn().mockReturnThis(),json:jest.fn()}
  }
  beforeEach(()=>{
    jest.clearAllMocks()
  })
  describe('obtenerTodas',()=>{
    test('responde 200 con los usuarios',async()=>{
      const req={}
      const res=crearRes()
      const usuarios=[
        {id:2,nombre:'Ana',email:'ana@test.com'},
        {id:1,nombre:'Ricardo',email:'ricardo@test.com'}
      ]
      service.obtenerTodas.mockResolvedValue(usuarios)
      await usuariosController.obtenerTodas(req,res)
      expect(service.obtenerTodas).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        ok:true,
        usuarios
      })
    })
    test('responde 500 si ocurre un error',async()=>{
      const req={}
      const res=crearRes()
      service.obtenerTodas.mockRejectedValue(new Error('DB error'))
      await usuariosController.obtenerTodas(req,res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'Error al obtener los usuarios'
      })
    })
  })
  describe('obtenerPorId',()=>{
    test('responde 200 con el usuario',async()=>{
      const req={params:{id:'1'}}
      const res=crearRes()
      const usuario={id:1,nombre:'Ricardo',email:'test@test.com'}
      service.obtenerPorId.mockResolvedValue(usuario)
      await usuariosController.obtenerPorId(req,res)
      expect(service.obtenerPorId).toHaveBeenCalledWith('1')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        ok:true,
        usuario
      })
    })
    test('responde 404 si el usuario no existe',async()=>{
      const req={params:{id:'999'}}
      const res=crearRes()
      service.obtenerPorId.mockRejectedValue(new Error('Usuario no encontrado'))
      await usuariosController.obtenerPorId(req,res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'Usuario no encontrado'
      })
    })
    test('responde 500 ante un error inesperado',async()=>{
      const req={params:{id:'1'}}
      const res=crearRes()
      service.obtenerPorId.mockRejectedValue(new Error('DB error'))
      await usuariosController.obtenerPorId(req,res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'Error al obtener el usuario'
      })
    })
  })
  describe('crear',()=>{
    test('responde 201 con usuario',async()=>{
      const req={body:{nombre:'Ricardo',email:'test@test.com',password:'1234'}}
      const res=crearRes()
      const usuario={id:1,nombre:'Ricardo',email:'test@test.com'}
      service.crear.mockResolvedValue(usuario)
      await usuariosController.crear(req,res)
      expect(service.crear).toHaveBeenCalledWith('Ricardo','test@test.com','1234')
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        ok:true,
        mensaje:'Usuario creado correctamente',
        usuario
      })
    })
    test('responde 409 si el email ya está registrado',async()=>{
      const req={body:{nombre:'Ricardo',email:'test@test.com',password:'1234'}}
      const res=crearRes()
      const error=new Error('duplicate key')
      error.code='23505'
      service.crear.mockRejectedValue(error)
      await usuariosController.crear(req,res)
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'El email ya está registrado'
      })
    })
    test('responde 500 ante un error inesperado',async()=>{
      const req={body:{nombre:'Ricardo',email:'test@test.com',password:'1234'}}
      const res=crearRes()
      service.crear.mockRejectedValue(new Error('DB error'))
      await usuariosController.crear(req,res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'Error al crear el usuario'
      })
    })
  })
  describe('actualizar',()=>{
    test('responde 200 con usuario actualizado',async()=>{
      const req={
        params:{id:'1'},
        body:{nombre:'Ricardo actualizado',email:'nuevo@test.com',password:'123456'}
      }
      const res=crearRes()
      const usuario={id:1,nombre:'Ricardo actualizado',email:'nuevo@test.com'}
      service.actualizar.mockResolvedValue(usuario)
      await usuariosController.actualizar(req,res)
      expect(service.actualizar).toHaveBeenCalledWith(
        '1',
        'Ricardo actualizado',
        'nuevo@test.com',
        '123456'
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        ok:true,
        mensaje:'Usuario actualizado correctamente',
        usuario
      })
    })
    test('responde 404 si el usuario no existe',async()=>{
      const req={
        params:{id:'999'},
        body:{nombre:'Ricardo',email:'test@test.com'}
      }
      const res=crearRes()
      service.actualizar.mockRejectedValue(new Error('Usuario no encontrado'))
      await usuariosController.actualizar(req,res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'Usuario no encontrado'
      })
    })
    test('responde 409 si el email ya está registrado',async()=>{
      const req={
        params:{id:'1'},
        body:{nombre:'Ricardo',email:'test@test.com'}
      }
      const res=crearRes()
      const error=new Error('duplicate key')
      error.code='23505'
      service.actualizar.mockRejectedValue(error)
      await usuariosController.actualizar(req,res)
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'El email ya está registrado'
      })
    })
    test('responde 500 ante un error inesperado',async()=>{
      const req={
        params:{id:'1'},
        body:{nombre:'Ricardo',email:'test@test.com'}
      }
      const res=crearRes()
      service.actualizar.mockRejectedValue(new Error('DB error'))
      await usuariosController.actualizar(req,res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'Error al actualizar el usuario'
      })
    })
  })
  describe('eliminar',()=>{
    test('responde 200 con el usuario eliminado',async()=>{
      const req={params:{id:'1'}}
      const res=crearRes()
      const usuario={id:1,nombre:'Ricardo',email:'test@test.com'}
      service.eliminar.mockResolvedValue(usuario)
      await usuariosController.eliminar(req,res)
      expect(service.eliminar).toHaveBeenCalledWith('1')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        ok:true,
        mensaje:'Usuario eliminado correctamente',
        usuario
      })
    })
    test('responde 404 si el usuario no existe',async()=>{
      const req={params:{id:'999'}}
      const res=crearRes()
      service.eliminar.mockRejectedValue(new Error('Usuario no encontrado'))
      await usuariosController.eliminar(req,res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'Usuario no encontrado'
      })
    })
    test('responde 500 ante un error inesperado',async()=>{
      const req={params:{id:'1'}}
      const res=crearRes()
      service.eliminar.mockRejectedValue(new Error('DB error'))
      await usuariosController.eliminar(req,res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        ok:false,
        mensaje:'Error al eliminar el usuario'
      })
    })
  })
})
