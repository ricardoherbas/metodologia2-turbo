jest.mock('../middlewares/auth.middleware', () => ({
  verificarToken: (req, res, next) => next()
}));

jest.mock('../services/movimientos.service', () => ({
  crear: jest.fn().mockResolvedValue({
    id: 1,
    usuario_id: 1,
    categoria_id: 2,
    tipo: 'ingreso',
    monto: 500,
    descripcion: 'sueldo',
    fecha: '2026-09-01'
  })
}));

const request = require('supertest');
const Server = require('../core/server');

const server = new Server();
const app = server.getApp();

describe('Movimientos routes', () => {
  it('POST /api/movimientos crea movimiento', async () => {
    const res = await request(app)
      .post('/api/movimientos')
      .set('Authorization', 'Bearer fakeToken')
      .send({ usuario_id: 1, categoria_id: 2, tipo: 'ingreso', monto: 500 });

    expect(res.statusCode).toBe(201);
    expect(res.body.movimiento).toBeDefined();
    expect(res.body.movimiento.tipo).toBe('ingreso');
    expect(res.body.movimiento.monto).toBe(500);
  });
});
