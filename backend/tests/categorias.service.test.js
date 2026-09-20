const service = require('../services/categorias.service');
const pool = require('../config/conexion-db');

jest.mock('../config/conexion-db');

describe('categoriasService', () => {
  it('crear devuelve la categoría creada', async () => {
    // Simulamos la respuesta de la DB
    pool.query.mockResolvedValue({
      rows: [{ id: 1, nombre: 'Alimentos', descripcion: 'compra en la cooperativa' }]
    });

    const categoria = await service.crear('Alimentos', 'compra en la cooperativa');

    expect(categoria.id).toBe(1);
    expect(categoria.nombre).toBe('Alimentos');
    expect(categoria.descripcion).toBe('compra en la cooperativa');
  });

  it('lanza error si la DB falla', async () => {
    // Simulamos un error de la DB
    pool.query.mockRejectedValue(new Error('DB error'));

    await expect(service.crear('Alimentos')).rejects.toThrow('DB error');
  });
});
