'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Proyecto', {
      idProyecto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Nombre: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Descripcion: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Objetivo: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Presupuesto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      Estado: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      FechaInicio: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      FechaFin: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      Activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
    await queryInterface.createTable('Costo', {
      idCosto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CostoTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      Proyecto_idProyecto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Proyecto',
          key: 'idProyecto',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.createTable('Permiso', {
      idPermiso: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      NombrePermiso: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
    });
    await queryInterface.createTable('Recurso', {
      idRecurso: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Nombre: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      TipoRecurso: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
    });
    await queryInterface.createTable('Tarea', {
      idTarea: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Nombre: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Descripcion: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      FechaInicio: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      FechaFin: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      Estado: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      Recurso_idRecurso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Recurso',
          key: 'idRecurso',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.createTable('Proyecto_Tarea', {
      idProyecto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Proyecto',
          key: 'idProyecto',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      idTarea: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tarea',
          key: 'idTarea',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.createTable('Rol', {
      idRol: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      NombreRol: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
    });
    await queryInterface.createTable('Rol_Permiso', {
      idRol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rol',
          key: 'idRol',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      idPermiso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Permiso',
          key: 'idPermiso',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.createTable('Usuario_Rol', {
      idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'idUsuario',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      idRol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rol',
          key: 'idRol',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.createTable('Usuario_Tarea', {
      idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'idUsuario',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      idTarea: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tarea',
          key: 'idTarea',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Usuario_Tarea');
    await queryInterface.dropTable('Usuario_Rol');
    await queryInterface.dropTable('Rol_Permiso');
    await queryInterface.dropTable('Rol');
    await queryInterface.dropTable('Proyecto_Tarea');
    await queryInterface.dropTable('Tarea');
    await queryInterface.dropTable('Recurso');
    await queryInterface.dropTable('Permiso');
    await queryInterface.dropTable('Costo');
    await queryInterface.dropTable('Proyecto');
  },
};
