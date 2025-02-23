import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Costo extends Model {
    static associate(models) {
      Costo.belongsTo(models.Proyecto, {
        foreignKey: 'Proyecto_idProyecto',
      });
    }
  }

  Costo.init(
    {
      idCosto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      CostoTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Costo',
      tableName: 'Costo',
      timestamps: false,
    }
  );

  return Costo;
};
