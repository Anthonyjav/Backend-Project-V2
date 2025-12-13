const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


// Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    console.log('Usuarios encontrados:', usuarios);
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { password, ...usuarioSinPassword } = usuario.toJSON();
    res.json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});
// Crear un nuevo usuario (registro)
router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'Ya existe un usuario con este correo' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol: rol || 'admin',
    });


    // Ocultar contraseña al responder
    const { password: pw, ...usuarioSinPassword } = usuario.toJSON();
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
});

const jwt = require('jsonwebtoken');

// Iniciar sesión (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailNormalizado = email.toLowerCase().trim();

    const usuario = await Usuario.findOne({
      where: { email: emailNormalizado },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 👉 aquí se genera el token
    const { password: pw, ...usuarioSinPassword } = usuario.toJSON();

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 👉 UNA sola respuesta
    res.json({
      usuario: usuarioSinPassword,
      token,
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// 🔧 Editar un usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, password, rol } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const datosActualizados = {
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      email: email || usuario.email,
      rol: rol || usuario.rol
    };

    if (password) {
      datosActualizados.password = await bcrypt.hash(password, 10);
    }

    await usuario.update(datosActualizados);

    const { password: pw, ...usuarioSinPassword } = usuario.toJSON();
    res.json({ mensaje: 'Usuario actualizado', usuario: usuarioSinPassword });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});
// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


module.exports = router;
