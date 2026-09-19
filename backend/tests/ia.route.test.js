jest.mock('../services/ia.service', () => ({
  generarSQL: jest.fn().mockResolvedValue('SELECT COUNT(*) FROM usuarios;'),
  generarRespuesta: jest.fn().mockResolvedValue('Hay 10 usuarios registrados.')
}));

jest.mock('../services/db.service', () => ({
  obtenerContextoIA: jest.fn().mockResolvedValue({
    usuarios: [
      {
        id: 1,
        nombre: 'Ricardo',
        email: 'test@test.com'
      }
    ]
  }),
  ejecutarSQL: jest.fn().mockResolvedValue([
    {
      count: 10
    }
  ])
}));

jest.mock('../middlewares/auth.middleware', () => ({
  verificarToken: (req, res, next) => next()
}));

const request = require('supertest');
const Server = require('../core/server');

const server = new Server();
const app = server.getApp();

describe('IA routes', () => {
  it('POST /api/ia/consultar responde con resultado', async () => {
    const res = await request(app)
      .post('/api/ia/consultar')
      .set('Authorization', 'Bearer fakeToken')
      .send({
        pregunta: '¿Cuántos usuarios hay?',
        usuarioId: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.respuesta).toBe('Hay 10 usuarios registrados.');
  });
});