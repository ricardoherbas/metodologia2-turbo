const iaService = require('../services/ia.service');
const { conexionIA } = require('../config/conexion-ia');

jest.mock('../config/conexion-ia');

describe('iaService', () => {
  it('generarSQL devuelve consulta válida', async () => {
    // Simulamos que la IA devuelve un SQL válido
    conexionIA.mockResolvedValue('SELECT * FROM usuarios;');

    const sql = await iaService.generarSQL(
      '¿Cuántos usuarios hay?',
      1,
      { tablas: ['usuarios'] }
    );

    expect(sql).toMatch(/^SELECT/); // debe empezar con SELECT
    expect(sql).toContain('usuarios'); // debe incluir la tabla usuarios
  });

  it('generarRespuesta devuelve texto', async () => {
    // Simulamos que la IA devuelve una respuesta en lenguaje natural
    conexionIA.mockResolvedValue('Hay 10 usuarios registrados.');

    const respuesta = await iaService.generarRespuesta(
      '¿Cuántos usuarios hay?',
      [{ count: 10 }]
    );

    expect(respuesta).toContain('usuarios');
    expect(respuesta).toMatch(/10/); // debe mencionar el número
  });

  it('lanza error si la IA no devuelve SQL válido', async () => {
    // Simulamos que la IA devuelve algo incorrecto
    conexionIA.mockResolvedValue('texto inválido');

    await expect(
      iaService.generarSQL('¿Cuántos usuarios hay?', 1, { tablas: ['usuarios'] })
    ).rejects.toThrow('La IA no devolvió una consulta SQL válida');
  });
});
