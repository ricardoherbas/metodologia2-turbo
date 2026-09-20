const { crear } = require('../controllers/usuarios.controller');
const service = require('../services/usuarios.service');

jest.mock('../services/usuarios.service');

describe('usuariosController', () => {
  it('crear responde 201 con usuario', async () => {
    const req = { body: { nombre: 'Ricardo', email: 'test@test.com', password: '1234' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    service.crear.mockResolvedValue({ id: 1, nombre: 'Ricardo', email: 'test@test.com' });

    await crear(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      mensaje: 'Usuario creado correctamente',
      usuario: { id: 1, nombre: 'Ricardo', email: 'test@test.com' }
    });
  });
});
