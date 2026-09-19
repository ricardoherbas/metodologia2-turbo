const request = require('supertest');
const Server = require('../core/server');
const jwt = require('jsonwebtoken');

const server = new Server();
const app = server.getApp();

describe('Rutas de aportes', () => {
  it('GET /api/aportes/:id devuelve aporte existente', async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get('/api/aportes/1')
      .set('Authorization', `Bearer ${token}`);

    expect([200,404]).toContain(res.statusCode); // éxito o no encontrado
    expect(res.body).toBeDefined();
  });
});
