module.exports = (sequelize, DataTypes) =>
  sequelize.define('Question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    statement: { type: DataTypes.TEXT, allowNull: false }
  });
