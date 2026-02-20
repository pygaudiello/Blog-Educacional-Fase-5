const { Quiz, Question, Option, QuizAnswer, QuestionAnswer } = require('../models');

// responder quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Envie as respostas" });
    }

    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: Question, include: [Option] }],
    });

    if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

    const alreadyAnswered = await QuestionAnswer.findOne({
      where: { QuizId: quiz.id, UserId: req.user.id },
    });

    if (alreadyAnswered) {
      return res.status(400).json({ error: "Você já respondeu este quiz." });
    }

    let score = 0;
    const total = quiz.Questions.length;

    for (const answer of answers) {
      if (!answer?.questionId || !answer?.optionId) continue;

      const question = quiz.Questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      const selectedOption = question.Options.find((o) => o.id === answer.optionId);
      if (!selectedOption) continue;

      await QuestionAnswer.create({
        QuizId: quiz.id,
        UserId: req.user.id,
        QuestionId: question.id,
        OptionId: selectedOption.id,
      });

      const correctOption = question.Options.find((o) => o.isCorrect);
      if (correctOption && correctOption.id === selectedOption.id) score++;
    }

    const percentage = total > 0 ? (score / total) * 100 : 0;

    await QuizAnswer.create({
      score,
      percentage,
      QuizId: quiz.id,
      UserId: req.user.id,
    });

    return res.json({ score, total, percentage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// respostas
exports.getUserQuizAnswers = async (req, res) => {
  try {
    const { quizId } = req.params;

    const answers = await QuestionAnswer.findAll({
      where: { QuizId: quizId, UserId: req.user.id },
    });

    if (!answers.length) return res.json({ answered: false });

    return res.json({ answered: true, answers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// status que o professor ve
exports.getQuizStats = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: Question, include: [Option] }],
    });

    if (!quiz) return res.status(404).json({ error: 'Quiz não encontrado' });

    const answers = await QuestionAnswer.findAll({
      where: { QuizId: quiz.id },
      attributes: ['QuestionId', 'OptionId', 'UserId'],
    });

    const stats = quiz.Questions.map((q) => {
      const questionAnswers = answers.filter((a) => a.QuestionId === q.id);

      const correctOpt = q.Options.find((o) => o.isCorrect);
      const totalResponses = questionAnswers.length;

      const countsByOption = q.Options.map((opt) => {
        const count = questionAnswers.filter((a) => a.OptionId === opt.id).length;
        return {
          optionId: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          count,
        };
      });

      const correctCount = correctOpt
        ? questionAnswers.filter((a) => a.OptionId === correctOpt.id).length
        : 0;

      return {
        questionId: q.id,
        statement: q.statement,
        totalResponses,
        correctCount,
        countsByOption,
      };
    });

    return res.json({ quizId: quiz.id, stats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// atualizar textos (professor -> teacher)
exports.updateQuizTexts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Envie questions[]' });
    }
    for (const q of questions) {
      if (q.id && typeof q.statement === 'string') {
        await Question.update(
          { statement: q.statement },
          { where: { id: q.id, QuizId: quizId } }
        );
      }
      if (Array.isArray(q.options)) {
        for (const opt of q.options) {
          if (opt.id && typeof opt.text === 'string') {
            await Option.update(
              { text: opt.text },
              { where: { id: opt.id } }
            );
          }
        }
      }
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

