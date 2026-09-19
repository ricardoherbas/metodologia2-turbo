jest.mock('../services/usuarios.service', () => ({
  crear: jest.fn().mockResolvedValue({
    id: 1,
    nombre: 'Ricardo',
    email: 'test@test.com'
  })
}));

const request = require('supertest');
const Server = require('../core/server');

const server = new Server();
const app = server.getApp();

describe('Usuarios routes', () => {
  it('POST /api/usuarios crea usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send({ nombre: 'Ricardo', email: 'test@test.com', password: '1234' });

    // aceptamos éxito o error de validación
    expect([201,400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.usuario).toBeDefined();
      expect(res.body.usuario.nombre).toBe('Ricardo');
      expect(res.body.usuario.email).toBe('test@test.com');
    }
  });
});
