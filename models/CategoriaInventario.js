'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const CategoriaInventario = sequelize.define(
    'CategoriaInventario',
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'CategoriaInventarios',
    }
  );

  CategoriaInventario.associate = models => {
    CategoriaInventario.hasMany(models.InventarioProducto, {
      foreignKey: 'categoriaInventarioId',
    });
  };

  return CategoriaInventario;
};
