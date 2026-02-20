module.exports = (sequelize, DataTypes) =>
  sequelize.define('Quiz', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
  });
