jest.mock('../services/auth.service', () => ({
  login: jest.fn().mockResolvedValue({
    usuario: { id: 1, email: 'test@test.com' },
    token: 'fakeToken123'
  })
}));

const request = require('supertest');
const Server = require('../core/server');

const server = new Server();
const app = server.getApp();

describe('Auth routes', () => {
  it('POST /api/auth/login devuelve token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: '1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('fakeToken123');
  });
});
