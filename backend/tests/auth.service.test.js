const authService = require('../services/auth.service')
const pool = require('../config/conexion-db')
const bcrypt = require('bcrypt')

jest.mock('../config/conexion-db')

jest.mock('../utils/email.util', () => ({
  enviarEmail: jest.fn()
}))

const { enviarEmail } = require('../utils/email.util')

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('login devuelve token y usuario', async () => {
    const passwordHash = await bcrypt.hash('1234', 10)

    pool.query.mockResolvedValue({
      rows: [
        {
          id: 1,
          nombre: 'Ricardo',
          email: 'test@test.com',
          password_hash: passwordHash
        }
      ]
    })

    const result = await authService.login('test@test.com', '1234')

    expect(result.usuario.email).toBe('test@test.com')
    expect(result.token).toBeDefined()
  })

  it('recuperarPassword genera token y envia email', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            email: 'test@test.com'
          }
        ]
      })
      .mockResolvedValueOnce({
        rows: []
      })

    enviarEmail.mockResolvedValue()

    process.env.FRONTEND_URL = 'http://localhost:8081'

    const result = await authService.recuperarPassword('test@test.com')

    expect(result.mensaje).toBe('Se envió el correo de recuperación')
    expect(enviarEmail).toHaveBeenCalledTimes(1)

    expect(enviarEmail).toHaveBeenCalledWith(
      'test@test.com',
      'Recuperación de contraseña',
      expect.stringContaining('restablecer-password.html?token=')
    )
  })

  it('recuperarPassword lanza error si el usuario no existe', async () => {
    pool.query.mockResolvedValueOnce({
      rows: []
    })

    await expect(
      authService.recuperarPassword('noexiste@test.com')
    ).rejects.toThrow('Usuario no encontrado')

    expect(enviarEmail).not.toHaveBeenCalled()
  })

  it('restablecerPassword cambia la contraseña y marca el token como usado', async () => {
    const token = 'token-prueba'
    const tokenHash = require('crypto')
      .createHash('sha256')
      .update(token)
      .digest('hex')

    pool.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            usuario_id: 1,
            expira_en: new Date(Date.now() + 30 * 60 * 1000),
            usado: false
          }
        ]
      })
      .mockResolvedValueOnce({
        rows: []
      })
      .mockResolvedValueOnce({
        rows: []
      })

    const result = await authService.restablecerPassword(
      token,
      'NuevaPassword123'
    )

    expect(result.mensaje).toBe(
      'Contraseña restablecida correctamente'
    )

    expect(pool.query).toHaveBeenCalledTimes(3)

    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        'SELECT id,usuario_id,expira_en,usado'
      ),
      [tokenHash]
    )

    expect(pool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(
        'UPDATE usuarios SET password_hash=$1 WHERE id=$2'
      ),
      [
        expect.any(String),
        1
      ]
    )

    expect(pool.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(
        'UPDATE recuperacion_password SET usado=TRUE'
      ),
      [1]
    )
  })

  it('restablecerPassword rechaza un token invalido', async () => {
    pool.query.mockResolvedValueOnce({
      rows: []
    })

    await expect(
      authService.restablecerPassword(
        'token-invalido',
        'NuevaPassword123'
      )
    ).rejects.toThrow('Token inválido')
  })

  it('restablecerPassword rechaza un token ya utilizado', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          usuario_id: 1,
          expira_en: new Date(Date.now() + 30 * 60 * 1000),
          usado: true
        }
      ]
    })

    await expect(
      authService.restablecerPassword(
        'token-usado',
        'NuevaPassword123'
      )
    ).rejects.toThrow('El token ya fue utilizado')
  })

  it('restablecerPassword rechaza un token expirado', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          usuario_id: 1,
          expira_en: new Date(Date.now() - 1000),
          usado: false
        }
      ]
    })

    await expect(
      authService.restablecerPassword(
        'token-expirado',
        'NuevaPassword123'
      )
    ).rejects.toThrow('El token ha expirado')
  })
})
