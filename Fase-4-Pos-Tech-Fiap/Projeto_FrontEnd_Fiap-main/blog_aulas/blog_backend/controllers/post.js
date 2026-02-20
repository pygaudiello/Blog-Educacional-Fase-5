const { Post, Comment, User, Quiz, Question, Option } = require('../models');
const { Op } = require('sequelize');

// listar posts com quiz opcional
exports.getPosts = async (req, res) => {
    try {
        const q = req.query.q || "";

        let where = {};
        if (q) {
            where = {
                [Op.or]: [
                    { title: { [Op.like]: `%${q}%` } },
                    { content: { [Op.like]: `%${q}%` } }
                ]
            };
        }

        const posts = await Post.findAll({
            where,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Quiz,
                    required: false,
                    include: [
                        {
                            model: Question,
                            include: [
                                {
                                    model: Option,
                                    attributes: { exclude: ["isCorrect"] }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.upsertPostQuiz = async (req, res) => {
  try {
    const { Post, Quiz, Question, Option } = require('../models');
    const postId = Number(req.params.id);
    const { quiz } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    if (!quiz?.questions?.length) {
      return res.status(400).json({ error: 'Envie perguntas do quiz' });
    }

    // Se já existir quiz, apaga e recria (mais simples e funciona)
    const existingQuiz = await Quiz.findOne({ where: { PostId: postId } });
    if (existingQuiz) {
      await existingQuiz.destroy();
    }

    const createdQuiz = await Quiz.create({ PostId: postId });

    for (const q of quiz.questions) {
      if (!q.statement || !q.options?.length) continue;

      const createdQuestion = await Question.create({
        statement: q.statement,
        QuizId: createdQuiz.id,
      });

      for (const opt of q.options) {
        if (!opt.text) continue;

        await Option.create({
          text: opt.text,
          isCorrect: opt.isCorrect === true,
          QuestionId: createdQuestion.id,
        });
      }
    }

    // devolve o post completo já com quiz
    const fullPost = await Post.findByPk(postId, {
      include: [
        { model: Quiz, include: [{ model: Question, include: [Option] }] },
      ],
    });

    return res.json(fullPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};


// ver post por id
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                Comment,
                {
                    model: Quiz,
                    include: [
                        {
                            model: Question,
                            include: [Option]
                        }
                    ]
                }
            ]
        });

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        res.json(post);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// criar post (com quiz opcional)
exports.createPost = async (req, res) => {
    try {
        console.log("CREATE POST - BODY QUIZ:", req.body.quiz);
        const { title, content, quiz } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Preencha todos os campos" });
        }

        const post = await Post.create({
            title,
            content,
            author: req.user.username,
            ownerId: req.user.id
        });

        // Se existir quiz
        if (quiz && quiz.questions && quiz.questions.length > 0) {

            const createdQuiz = await Quiz.create({
                PostId: post.id
            });
            console.log("QUIZ CRIADO:", createdQuiz.toJSON());

            for (const question of quiz.questions) {

                if (!question.statement || !question.options || question.options.length === 0) {
                    continue;
                }

                const createdQuestion = await Question.create({
                    statement: question.statement,
                    QuizId: createdQuiz.id
                });

                for (const option of question.options) {

                    if (!option.text) continue;

                    await Option.create({
                        text: option.text,
                        isCorrect: option.isCorrect === true,
                        QuestionId: createdQuestion.id
                    });
                }
            }
        }

        const fullPost = await Post.findByPk(post.id, {
    include: [
        {
            model: Quiz,
            include: [
                {
                    model: Question,
                    include: [Option]
                }
            ]
        }
    ]
});

res.status(201).json(fullPost);


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// editar post
exports.putPost = async (req, res) => {
    try {
        console.log('PUT /api/posts/:id chamado. ID:', req.params.id);
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post não encontrado' });

        post.title = req.body.title;
        post.content = req.body.content;

        await post.save();
        res.json(post);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// deletar post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        await post.destroy();
        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// adc comentário
exports.postComment = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post não encontrado' });

        const { author, content } = req.body;

        const comment = await Comment.create({
            author,
            content,
            PostId: post.id
        });

        res.status(201).json(comment);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// deletar comentário
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });

        if (comment.author !== req.user.username && req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Não autorizado' });
        }

        await comment.destroy();
        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// editar comentário
exports.putComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });

        if (comment.author !== req.user.username) {
            return res.status(403).json({ error: 'Não autorizado' });
        }

        comment.content = req.body.content;
        await comment.save();

        res.json(comment);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
