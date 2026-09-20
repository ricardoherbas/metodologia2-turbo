const { crear } = require('../controllers/movimientos.controller');
const service = require('../services/movimientos.service');

jest.mock('../services/movimientos.service');

describe('movimientosController', () => {
  it('crear responde 201 con movimiento', async () => {
    const req = { body: { usuario_id: 1, categoria_id: 2, tipo: 'ingreso', monto: 500 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    service.crear.mockResolvedValue({ id: 1, usuario_id: 1, categoria_id: 2, tipo: 'ingreso', monto: 500 });

    await crear(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      mensaje: 'Movimiento creado correctamente',
      movimiento: { id: 1, usuario_id: 1, categoria_id: 2, tipo: 'ingreso', monto: 500 }
    });
  });
});
