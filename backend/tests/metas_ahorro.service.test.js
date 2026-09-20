const service = require('../services/metas_ahorro.service');
const pool = require('../config/conexion-db');

jest.mock('../config/conexion-db');

describe('metasAhorroService', () => {
  it('crear devuelve la meta creada', async () => {
    // Simulamos la respuesta de la DB
    pool.query.mockResolvedValue({
      rows: [{
        id: 1,
        usuario_id: 1,
        nombre: 'Viaje',
        monto_objetivo: 1000,
        monto_actual: 200,
        estado: 'en proceso',
        fecha_limite: null
      }]
    });

    const meta = await service.crear(1, 'Viaje', 1000, 200, 'en proceso', null);

    expect(meta.id).toBe(1);
    expect(meta.usuario_id).toBe(1);
    expect(meta.nombre).toBe('Viaje');
    expect(meta.monto_objetivo).toBe(1000);
    expect(meta.monto_actual).toBe(200);
    expect(meta.estado).toBe('en proceso');
  });

  it('lanza error si la DB falla', async () => {
    // Simulamos un error de la DB
    pool.query.mockRejectedValue(new Error('DB error'));

    await expect(
      service.crear(1, 'Viaje', 1000, 200, 'en proceso', null)
    ).rejects.toThrow('DB error');
  });
});
