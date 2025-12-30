'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  const InventarioProducto = sequelize.define(
    'InventarioProducto',
    {
      codigoProducto: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      nombreProducto: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      precioCompra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      precioVenta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      ganancia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'InventarioProductos',
    }
  );

  InventarioProducto.associate = models => {
    InventarioProducto.belongsTo(models.CategoriaInventario, {
      foreignKey: 'categoriaInventarioId',
    });
  };

  return InventarioProducto;
};
