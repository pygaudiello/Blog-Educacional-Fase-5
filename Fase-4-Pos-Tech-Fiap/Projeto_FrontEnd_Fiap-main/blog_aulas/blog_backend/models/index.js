const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_FILE || './database.sqlite',
});

// Models principais
const User = require('./user')(sequelize, DataTypes);
const Post = require('./post')(sequelize, DataTypes);
const Comment = require('./comment')(sequelize, DataTypes);

// Models do Quiz
const Quiz = require('./quiz')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const Option = require('./option')(sequelize, DataTypes);
const QuizAnswer = require('./quizAnswer')(sequelize, DataTypes);
const QuestionAnswer = require('./questionAnswer')(sequelize, DataTypes);

// ===== ASSOCIAÇÕES =====

// Post -> Comment
Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);

// User -> Post
User.hasMany(Post);
Post.belongsTo(User, { as: 'owner' });

// Post -> Quiz
Post.hasOne(Quiz, { onDelete: 'CASCADE' });
Quiz.belongsTo(Post);

// Quiz -> Question
Quiz.hasMany(Question, { onDelete: 'CASCADE' });
Question.belongsTo(Quiz);

// Question -> Option
Question.hasMany(Option, { onDelete: 'CASCADE' });
Option.belongsTo(Question);

// QuizAnswer (resumo final)
Quiz.hasMany(QuizAnswer, { onDelete: 'CASCADE' });
QuizAnswer.belongsTo(Quiz);

User.hasMany(QuizAnswer, { onDelete: 'CASCADE' });
QuizAnswer.belongsTo(User);

// QuestionAnswer (resposta por pergunta)
Quiz.hasMany(QuestionAnswer, { onDelete: 'CASCADE' });
QuestionAnswer.belongsTo(Quiz);

User.hasMany(QuestionAnswer, { onDelete: 'CASCADE' });
QuestionAnswer.belongsTo(User);

Question.hasMany(QuestionAnswer, { onDelete: 'CASCADE' });
QuestionAnswer.belongsTo(Question);

Option.hasMany(QuestionAnswer, { onDelete: 'CASCADE' });
QuestionAnswer.belongsTo(Option);

module.exports = {
  sequelize,
  Sequelize,
  Op,
  User,
  Post,
  Comment,
  Quiz,
  Question,
  Option,
  QuizAnswer,
  QuestionAnswer,
};
