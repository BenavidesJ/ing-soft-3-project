'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuario', {
      idUsuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Nombre: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Apellido1: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Apellido2: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      Correo: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,
      },
      Contrasena: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      NombreUsuario: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      CreatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      UpdatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Usuario');
  },
};
