jest.mock('../services/usuarios.service', () => ({
  obtenerTodas: jest.fn().mockResolvedValue([
    {
      id: 1,
      nombre: 'Ricardo',
      email: 'test@test.com'
    }
  ])
}))

const request = require('supertest')
const jwt = require('jsonwebtoken')
const Server = require('../core/server')

const server = new Server()
const app = server.getApp()

describe('Servidor Express', () => {
  it('responde en la ruta base de usuarios', async () => {
    const token = jwt.sign(
      {
        id: 1,
        email: 'test@test.com'
      },
      process.env.JWT_SECRET
    )

    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.usuarios).toBeDefined()
    expect(res.body.usuarios[0].nombre).toBe('Ricardo')
  })
})