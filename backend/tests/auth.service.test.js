const authService = require('../services/auth.service');
const pool = require('../config/conexion-db');
const bcrypt = require('bcrypt');

jest.mock('../config/conexion-db');

describe('authService', () => {
  it('login devuelve token y usuario', async () => {
    const passwordHash = await bcrypt.hash('1234', 10);

    pool.query.mockResolvedValue({
      rows: [{ id: 1, nombre: 'Ricardo', email: 'test@test.com', password_hash: passwordHash }]
    });

    const result = await authService.login('test@test.com', '1234');
    expect(result.usuario.email).toBe('test@test.com');
    expect(result.token).toBeDefined();
  });
});
