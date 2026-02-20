module.exports = (sequelize, DataTypes) =>
  sequelize.define('QuizAnswer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    score: { type: DataTypes.FLOAT, allowNull: false }
  });
