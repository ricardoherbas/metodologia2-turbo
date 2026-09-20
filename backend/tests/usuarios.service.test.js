const usuariosService = require('../services/usuarios.service');
const pool = require('../config/conexion-db');
const bcrypt = require('bcrypt');

// Mockeamos el pool Y bcrypt (para no hashear de verdad en los tests)
jest.mock('../config/conexion-db', () => ({
  query: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('usuariosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bcrypt.hash.mockResolvedValue('hash_simulado'); // el hash es constante en tests
  });

  test('crea el usuario y devuelve sus datos (sin el hash)', async () => {
    pool.query.mockResolvedValue({
      rows: [{
        id: 1,
        nombre: 'Ricardo',
        email: 'test@test.com',
        creado_en: '2026-09-18'
      }]
    });

    const usuario = await usuariosService.crear('Ricardo', 'test@test.com', '1234');

    expect(usuario.id).toBe(1);
    expect(usuario.email).toBe('test@test.com');
    expect(usuario.password_hash).toBeUndefined(); // RETURNING no incluye el hash ✅

    // bcrypt fue llamado con la password en texto plano
    expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);

    // UNA sola query: el INSERT
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO usuarios'),
      ['Ricardo', 'test@test.com', 'hash_simulado']
    );
  });

  test('propaga el error cuando el email ya existe (duplicate key)', async () => {
    pool.query.mockRejectedValue(
      new Error('duplicate key value violates unique constraint "usuarios_email_key"')
    );

    await expect(
      usuariosService.crear('Ricardo', 'test@test.com', '1234')
    ).rejects.toThrow('duplicate key');

    expect(pool.query).toHaveBeenCalledTimes(1); // nunca llega a un segundo paso
  });

  test('lanza error si la DB falla', async () => {
    pool.query.mockRejectedValue(new Error('DB error'));

    await expect(
      usuariosService.crear('Ricardo', 'test@test.com', '1234')
    ).rejects.toThrow('DB error');
  });
});