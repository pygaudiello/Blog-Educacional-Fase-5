import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import './PostView.module.css';

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [commentForm, setCommentForm] = useState({ author: '', content: '' });

  // DEBUG para ver o que está acontecendo
  console.log('🔍 useParams id:', id);
  console.log('📍 URL atual:', window.location.href);

  useEffect(() => {
    console.log('🎯 Buscando post com ID:', id);

    // Se o ID é inválido (ainda :id), não faz a requisição
    if (!id || id === ':id') {
      console.log('❌ ID inválido, aguardando...');
      return;
    }

    api.get(`/posts/${id}`)
      .then(r => {
        console.log('✅ Post carregado:', r.data);
        setPost(r.data);
        setError(false);
      })
      .catch(e => {
        console.error("❌ Erro:", e.response?.data);
        setError(true);
        setPost(null);
      });
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/posts/${id}/comments`, commentForm);
      console.log('✅ Comentário adicionado:', response.data);

      // Recarrega o post para mostrar o novo comentário
      const updatedPost = await api.get(`/posts/${id}`);
      setPost(updatedPost.data);

      setCommentForm({ author: '', content: '' });
      alert('Comentário adicionado!');
    } catch (error) {
      console.error('❌ Erro comentário:', error);
      alert('Erro ao adicionar comentário');
    }
  };

  // Renderização
  if (!id || id === ':id') {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>🔗 Link Inválido</h2>
        <p>O link para este post está incorreto.</p>
        <button onClick={() => navigate('/')}>Voltar para Home</button>
      </div>
    );
  }

  if (post === null && !error) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>❌ Post Não Encontrado</h2>
        <p>O post que você está tentando acessar não existe.</p>
        <button onClick={() => navigate('/')}>Voltar para Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* POST */}
      <article className="post-article">
        <h1>{post.title}</h1>
        <p className="post-meta">
          Por: {post.author} • {new Date(post.createdAt).toLocaleDateString('pt-BR')}
        </p>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* COMENTÁRIOS */}
      <section className="comments-section">
        <h2>💬 Comentários ({post.Comments?.length || 0})</h2>
        {post.Comments?.length ? (
          post.Comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <strong>{comment.author}</strong>
              <p>{comment.content}</p>
              <small>{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</small>
            </div>
          ))
        ) : (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum comentário ainda.</p>
        )}
      </section>

      {/* FORMULÁRIO COMENTÁRIO */}
      <section className="comment-form">
        <h3>✍️ Adicionar Comentário</h3>
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Seu nome"
            value={commentForm.author}
            onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
            style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
          <textarea
            placeholder="Seu comentário"
            value={commentForm.content}
            onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
            rows="4"
            style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Enviar Comentário
          </button>
        </form>
      </section>
    </div>
  );
}