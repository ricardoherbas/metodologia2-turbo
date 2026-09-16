
// guardProtectedPage() + ver/editar datos del usuario logueado (GET/PUT /usuarios/:id)
import { guardProtectedPage } from '../utils/protectedPage.js';
guardProtectedPage();

import { getUsuario, getToken, setSession } from '../store/authStore.js';
import * as authApi from '../api/auth.js';
import * as usuariosApi from '../api/usuarios.js';

const usuario = getUsuario();

const form = document.getElementById('form-perfil');
const inputNombre = document.getElementById('nombre');
const inputEmail = document.getElementById('email');
const mensaje = document.getElementById('mensaje-perfil');

async function cargarPerfil() {
    const respuesta = await authApi.getPerfil();
    inputNombre.value = respuesta.usuario.nombre;
    inputEmail.value = respuesta.usuario.email;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const datos = {
    nombre: inputNombre.value,
    email: inputEmail.value,
    password: document.getElementById('password').value,
    };

    const respuesta = await usuariosApi.actualizar(usuario.id, datos);

    setSession(getToken(), respuesta.usuario);
    
    mensaje.textContent = 'Datos actualizados correctamente.';
    form.reset(); // por seguridad, no dejamos la contraseña escrita en pantalla
    cargarPerfil(); // recargamos nombre/email en el formulario después del reset
});
cargarPerfil();