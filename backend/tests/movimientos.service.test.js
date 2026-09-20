const service = require('../services/movimientos.service');
const pool = require('../config/conexion-db');

jest.mock('../config/conexion-db');

describe('movimientosService', () => {
  it('crear devuelve el movimiento creado', async () => {
    // Simulamos la respuesta de la DB
    pool.query.mockResolvedValue({
      rows: [{
        id: 1,
        usuario_id: 1,
        categoria_id: 2,
        tipo: 'ingreso',
        monto: 500,
        descripcion: 'sueldo',
        fecha: '2026-09-01'
      }]
    });

    const movimiento = await service.crear(1, 2, 'ingreso', 500, 'sueldo', '2026-09-01');

    expect(movimiento.id).toBe(1);
    expect(movimiento.usuario_id).toBe(1);
    expect(movimiento.categoria_id).toBe(2);
    expect(movimiento.tipo).toBe('ingreso');
    expect(movimiento.monto).toBe(500);
    expect(movimiento.descripcion).toBe('sueldo');
    expect(movimiento.fecha).toBe('2026-09-01');
  });

  it('lanza error si la DB falla', async () => {
    // Simulamos un error de la DB
    pool.query.mockRejectedValue(new Error('DB error'));

    await expect(
      service.crear(1, 2, 'ingreso', 500, 'sueldo', '2026-09-01')
    ).rejects.toThrow('DB error');
  });
});
