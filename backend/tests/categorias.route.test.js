jest.mock('../services/categorias.service', () => ({
  crear: jest.fn().mockResolvedValue({ id: 1, nombre: 'Alimentos' })
}));

const request = require('supertest');
const Server = require('../core/server');

const server = new Server();
const app = server.getApp();

describe('Categorias routes', () => {
  it('POST /api/categorias crea categoría', async () => {
    const res = await request(app)
      .post('/api/categorias')
      .send({ nombre: 'Alimentos' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.categoria.nombre).toBe('Alimentos');
  });
});
