jest.mock('../services/categorias.service', () => ({
  crear: jest.fn().mockResolvedValue({
    id: 1,
    nombre: 'Alimentos'
  })
}))

const request = require('supertest')
const jwt = require('jsonwebtoken')
const Server = require('../core/server')

const server = new Server()
const app = server.getApp()

describe('Categorias routes', () => {
  it('POST /api/categorias crea categoría', async () => {
    const token = jwt.sign(
      {
        id: 1,
        email: 'test@test.com'
      },
      process.env.JWT_SECRET
    )

    const res = await request(app)
      .post('/api/categorias')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Alimentos'
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.categoria.nombre).toBe('Alimentos')
  })
})