const express = require('express');
const router = express.Router();
const { authenticateToken, requireTeacher } = require('../middleware/auth');
const postController = require('../controllers/post');

// listar posts (público) com busca q
router.get("/", postController.getPosts);

// ver post por id (com comentários)
router.get('/:id', postController.getPost);

// criar post (só professores autenticados)
router.post("/", authenticateToken, requireTeacher, postController.createPost);

// ✅ criar/atualizar quiz do post (só professores)  <-- SUBIU PRA CIMA
router.put('/:id/quiz', authenticateToken, requireTeacher, postController.upsertPostQuiz);

// editar post
router.put('/:id', authenticateToken, requireTeacher, postController.putPost);

// excluir post
router.delete('/:id', authenticateToken, requireTeacher, postController.deletePost);

// adicionar comentário (público)
router.post('/:id/comments', postController.postComment);

// excluir comentário
router.delete('/:id/comments/:commentId', authenticateToken, postController.deleteComment);

// editar comentário
router.put('/:id/comments/:commentId', authenticateToken, postController.putComment);

module.exports = router;
