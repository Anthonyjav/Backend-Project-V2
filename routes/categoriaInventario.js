const express = require('express');
const router = express.Router();

const { CategoriaInventario } = require('../models');
const auth = require('../middlewares/auth');
const hasRole = require('../middlewares/hasRole');

/* Crear categoría inventario */
router.post(
  '/',
  auth,
  hasRole('admin', 'employee'),
  async (req, res) => {
    try {
      const categoria = await CategoriaInventario.create(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* Listar categorías inventario */
router.get('/', async (req, res) => {
  try {
    const categorias = await CategoriaInventario.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Obtener categoría por ID */
router.get('/:id', async (req, res) => {
  try {
    const categoria = await CategoriaInventario.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Actualizar categoría */
router.put(
  '/:id',
  auth,
  hasRole('admin', 'employee'),
  async (req, res) => {
    try {
      const categoria = await CategoriaInventario.findByPk(req.params.id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      await categoria.update(req.body);
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* Eliminar categoría */
router.delete(
  '/:id',
  auth,
  hasRole('admin'),
  async (req, res) => {
    try {
      const categoria = await CategoriaInventario.findByPk(req.params.id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      await categoria.destroy();
      res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
