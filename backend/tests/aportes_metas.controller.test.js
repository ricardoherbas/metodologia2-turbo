const { obtenerPorId } = require('../controllers/aportes_metas.controller');
const service = require('../services/aportes_metas.service');

jest.mock('../services/aportes_metas.service');

describe('aportesMetasController', () => {
  it('devuelve aporte por id', async () => {
    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    service.obtenerPorId.mockResolvedValue({ id: 1, monto: 100 });

    await obtenerPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      aporte: { id: 1, monto: 100 }
    });
  });
});
