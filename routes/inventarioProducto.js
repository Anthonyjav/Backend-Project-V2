const express = require('express');
const router = express.Router();

const { InventarioProducto, CategoriaInventario } = require('../models');
const auth = require('../middlewares/auth');
const hasRole = require('../middlewares/hasRole');

/* Crear producto de inventario */
router.post(
  '/',
  auth,
  hasRole('admin', 'employee'),
  async (req, res) => {
    try {
      const {
        codigoProducto,
        nombreProducto,
        cantidad,
        precioCompra,
        precioVenta,
        categoriaInventarioId,
        estado,
      } = req.body;

      const ganancia = precioVenta - precioCompra;

      const producto = await InventarioProducto.create({
        codigoProducto,
        nombreProducto,
        cantidad,
        precioCompra,
        precioVenta,
        ganancia,
        categoriaInventarioId,
        estado,
      });

      res.status(201).json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* Listar inventario */
router.get('/', async (req, res) => {
  try {
    const productos = await InventarioProducto.findAll({
      include: {
        model: CategoriaInventario,
      },
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Obtener producto por ID */
router.get('/:id', async (req, res) => {
  try {
    const producto = await InventarioProducto.findByPk(req.params.id, {
      include: CategoriaInventario,
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Actualizar producto */
router.put(
  '/:id',
  auth,
  hasRole('admin', 'employee'),
  async (req, res) => {
    try {
      const producto = await InventarioProducto.findByPk(req.params.id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const {
        precioCompra,
        precioVenta,
      } = req.body;

      let ganancia = producto.ganancia;
      if (precioCompra !== undefined && precioVenta !== undefined) {
        ganancia = precioVenta - precioCompra;
      }

      await producto.update({
        ...req.body,
        ganancia,
      });

      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* Eliminar producto inventario */
router.delete(
  '/:id',
  auth,
  hasRole('admin'),
  async (req, res) => {
    try {
      const producto = await InventarioProducto.findByPk(req.params.id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await producto.destroy();
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
