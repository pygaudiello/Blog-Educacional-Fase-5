module.exports = (sequelize, DataTypes) =>
  sequelize.define('QuestionAnswer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  });
