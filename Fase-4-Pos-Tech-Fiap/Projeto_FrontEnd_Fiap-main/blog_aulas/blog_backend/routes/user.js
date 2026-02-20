const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

//  Buscar apenas professores
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: 'teacher' },
    });

    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar professores' });
  }
});

// Buscar apenas alunos
router.get('/students', async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
    });

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// Buscar todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Criar usuário
router.post('/', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Dados obrigatórios não informados' });
    }

    // Verificar se role é válido
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Role inválido' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      passwordHash,
      role,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

//Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = {};

    if (username) data.username = username;
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    const [updated] = await User.update(data, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar Profs e Alunos
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: {
        id: req.params.id,
        role: ['teacher', 'student']
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado ou não pode ser deletado' });
    }

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

module.exports = router;