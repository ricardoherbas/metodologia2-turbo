const { crear } = require('../controllers/categorias.controller');
const service = require('../services/categorias.service');

jest.mock('../services/categorias.service');

describe('categoriasController', () => {
  it('crear responde 201 con categoría', async () => {
    const req = { body: { nombre: 'Alimentos' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    service.crear.mockResolvedValue({ id: 1, nombre: 'Alimentos' });

    await crear(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      mensaje: 'Categoría creada correctamente',
      categoria: { id: 1, nombre: 'Alimentos' }
    });
  });
});
