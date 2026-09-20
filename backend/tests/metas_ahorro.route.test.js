jest.mock('../middlewares/auth.middleware', () => ({
  verificarToken: (req, res, next) => next()
}));

jest.mock('../services/metas_ahorro.service', () => ({
  crear: jest.fn().mockResolvedValue({
    id: 1,
    usuario_id: 1,
    nombre: 'Viaje',
    monto_objetivo: 1000,
    monto_actual: 0,
    estado: 'en proceso'
  })
}));

const request = require('supertest');
const Server = require('../core/server');

const server = new Server();
const app = server.getApp();

describe('Metas de ahorro routes', () => {
  it('POST /api/metas-ahorro crea meta', async () => {
    const res = await request(app)
      .post('/api/metas-ahorro')
      .set('Authorization', 'Bearer fakeToken')
      .send({ usuario_id: 1, nombre: 'Viaje', monto_objetivo: 1000 });

    expect(res.statusCode).toBe(201);
    expect(res.body.meta.nombre).toBe('Viaje');
    expect(res.body.meta.monto_objetivo).toBe(1000);
  });
});
