module.exports = (sequelize, DataTypes) =>
  sequelize.define('Option', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING, allowNull: false },
    isCorrect: { type: DataTypes.BOOLEAN, allowNull: false }
  });
