const { login } = require('../controllers/auth.controller');
const authService = require('../services/auth.service');

jest.mock('../services/auth.service');

describe('authController', () => {
  it('login responde 200 con usuario y token', async () => {
    const req = { body: { email: 'test@test.com', password: '1234' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    authService.login.mockResolvedValue({ usuario: { id: 1, email: 'test@test.com' }, token: 'abc123' });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      usuario: { id: 1, email: 'test@test.com' },
      token: 'abc123'
    });
  });
});
