const { crear } = require('../controllers/metas_ahorro.controller');
const service = require('../services/metas_ahorro.service');

jest.mock('../services/metas_ahorro.service');

describe('metasAhorroController', () => {
  it('crear responde 201 con meta', async () => {
    const req = { body: { usuario_id: 1, nombre: 'Viaje', monto_objetivo: 1000 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    service.crear.mockResolvedValue({ id: 1, usuario_id: 1, nombre: 'Viaje', monto_objetivo: 1000 });

    await crear(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      mensaje: 'Meta creada correctamente',
      meta: { id: 1, usuario_id: 1, nombre: 'Viaje', monto_objetivo: 1000 }
    });
  });
});
