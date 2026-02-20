import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import styles from './Home.module.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true); // Novo estado de carregamento

  // 1. useEffect para CARREGAMENTO INICIAL de todos os posts (só executa na montagem)
  useEffect(() => {
    // Usamos um novo useEffect para carregar posts imediatamente,
    // sem debounce, na montagem do componente.
    api.get('/posts')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(e => {
        console.error("Erro ao carregar posts iniciais:", e);
        setLoading(false);
      });
  }, []); // Array de dependências vazio: executa APENAS UMA VEZ.

  // 2. useEffect para BUSCA com DEBOUNCE (executa a cada mudança em 'q')
  useEffect(() => {
    if (loading) return; // Não executa a busca se o carregamento inicial ainda estiver pendente

    const t = setTimeout(async () => {
      // Aqui, a requisição é feita com o parâmetro 'q'
      const res = await api.get('/posts', { params: { q } });
      setPosts(res.data);
    }, 300);
    
    return () => clearTimeout(t);
  }, [q, loading]); // Depende de 'q' e 'loading'

  return (
    <div>
      <div className={styles.search}>
        <h1>Aulas</h1>
        <input placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div>
        {loading && <p>Carregando aulas...</p>}
        {!loading && posts.length === 0 && <p>Nenhuma aula encontrada. Tente buscar outro termo.</p>}

        {posts.map(post => (
          <article key={post.id}>
            <h2><Link to={`/post/${post.id}`}>{post.title}</Link></h2>
            <p>{post.author} • {post.excerpt || post.content.slice(0,150)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

