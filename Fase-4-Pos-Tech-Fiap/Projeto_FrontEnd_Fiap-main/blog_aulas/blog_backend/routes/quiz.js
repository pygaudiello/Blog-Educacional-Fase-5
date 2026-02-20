const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');
const { authenticateToken, requireTeacher } = require('../middleware/auth');

router.post('/:quizId/submit', authenticateToken, quizController.submitQuiz);
router.get('/:quizId/my-answers', authenticateToken, quizController.getUserQuizAnswers);
router.get('/:quizId/stats', authenticateToken, requireTeacher, quizController.getQuizStats);
router.put('/:quizId/texts', authenticateToken, requireTeacher, quizController.updateQuizTexts);

module.exports = router;
