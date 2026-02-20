module.exports = (sequelize, DataTypes) =>
    sequelize.define('Post', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        author: { type: DataTypes.STRING, allowNull: false },
        excerpt: { type: DataTypes.STRING }
    });
