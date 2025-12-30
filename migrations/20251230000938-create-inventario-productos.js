'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InventarioProductos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      codigoProducto: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      nombreProducto: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      precioCompra: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      precioVenta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      ganancia: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      estado: {
        type: Sequelize.ENUM('activo', 'agotado', 'inactivo'),
        defaultValue: 'activo',
      },

      categoriaInventarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CategoriaInventarios', // ✅ CORRECTO
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('InventarioProductos');
  },
};
