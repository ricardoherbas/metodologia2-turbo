const service = require('../services/aportes_metas.service');
const pool = require('../config/conexion-db');

jest.mock('../config/conexion-db');

describe('aportesMetasService', () => {
  it('crear aporte devuelve objeto', async () => {
    // Simulamos la respuesta de la DB
    pool.query.mockResolvedValue({
      rows: [{ id: 1, meta_id: 1, monto: 100, descripcion: 'primer aporte' }]
    });

    const aporte = await service.crear(1, 100, 'primer aporte');

    expect(aporte.meta_id).toBe(1);
    expect(aporte.monto).toBe(100);
    expect(aporte.descripcion).toBe('primer aporte');
  });
});
