const { consultarIA } = require('../controllers/ia.controller');
const iaService = require('../services/ia.service');
const dbService = require('../services/db.service');

jest.mock('../services/ia.service');
jest.mock('../services/db.service');

describe('iaController', () => {
  it('responde con SQL y respuesta final', async () => {
    const req = { body: { pregunta: '¿Cuántos usuarios hay?', usuarioId: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    dbService.obtenerContextoIA.mockResolvedValue({ tablas: ['usuarios'] });
    iaService.generarSQL.mockResolvedValue('SELECT COUNT(*) FROM usuarios;');
    dbService.ejecutarSQL.mockResolvedValue([{ count: 10 }]);
    iaService.generarRespuesta.mockResolvedValue('Hay 10 usuarios registrados.');

    await consultarIA(req, res);

    expect(res.json).toHaveBeenCalledWith({
      pregunta: '¿Cuántos usuarios hay?',
      sql: 'SELECT COUNT(*) FROM usuarios;',
      resultado: [{ count: 10 }],
      respuesta: 'Hay 10 usuarios registrados.'
    });
  });
});
