module.exports = (sequelize, DataTypes) =>
    sequelize.define('Comment', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        author: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false }
    });
