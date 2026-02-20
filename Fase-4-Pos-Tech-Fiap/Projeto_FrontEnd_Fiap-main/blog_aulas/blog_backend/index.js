require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
const usersRouter = require('./routes/user');
app.use('/api/users', usersRouter);
app.use('/api/quizzes', require('./routes/quiz'));

const PORT = process.env.PORT || 4000;

sequelize.sync().then(async () => {
    const existsTeacher = await User.findOne({ where: { username: 'prof1' } });
    if (!existsTeacher) {
        const hash = await bcrypt.hash('senha123', 10);
        await User.create({ username: 'prof1', passwordHash: hash, role: 'teacher' });
        console.log('Usuário prof1 criado (senha: senha123)');
    }

    const existsStudent = await User.findOne({ where: { username: 'aluno1' } });
    if (!existsStudent) {
        const hash = await bcrypt.hash('senha123', 10);
        await User.create({ username: 'aluno1', passwordHash: hash, role: 'student' });
        console.log('Usuário aluno1 criado (senha: senha123)');
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
});
