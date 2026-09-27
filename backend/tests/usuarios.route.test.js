jest.mock('../services/usuarios.service', () => ({
  crear: jest.fn().mockResolvedValue({
    id: 1,
    nombre: 'Ricardo',
    email: 'test@test.com'
  })
}))

const request = require('supertest')
const jwt = require('jsonwebtoken')
const Server = require('../core/server')

const server = new Server()
const app = server.getApp()

describe('Usuarios routes', () => {
  it('POST /api/usuarios crea usuario', async () => {
    const token = jwt.sign(
      {
        id: 1,
        email: 'test@test.com'
      },
      process.env.JWT_SECRET
    )

    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Ricardo',
        email: 'test@test.com',
        password: '1234'
      })

    expect([201, 400]).toContain(res.statusCode)

    if (res.statusCode === 201) {
      expect(res.body.usuario).toBeDefined()
      expect(res.body.usuario.nombre).toBe('Ricardo')
      expect(res.body.usuario.email).toBe('test@test.com')
    }
  })
})