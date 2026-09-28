jest.mock('../services/usuarios.service',()=>({
  obtenerTodas:jest.fn().mockResolvedValue([
    {
      id:1,
      nombre:'Ricardo',
      email:'test@test.com'
    }
  ])
}))
const request=require('supertest')
const jwt=require('jsonwebtoken')
const Server=require('../core/server')
process.env.JWT_SECRET='test-secret'
const server=new Server()
const app=server.getApp()
const generarToken=()=>{
  return jwt.sign(
    {
      id:1,
      email:'test@test.com'
    },
    process.env.JWT_SECRET
  )
}
describe('Servidor Express',()=>{
  test('responde en la ruta base de usuarios con token válido',async()=>{
    const res=await request(app)
      .get('/api/usuarios')
      .set('Authorization',`Bearer ${generarToken()}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      ok:true,
      usuarios:[
        {
          id:1,
          nombre:'Ricardo',
          email:'test@test.com'
        }
      ]
    })
  })
  test('rechaza la ruta de usuarios sin token',async()=>{
    const res=await request(app)
      .get('/api/usuarios')
    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({
      error:'Token requerido'
    })
  })
})
