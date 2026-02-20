import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import styles from "./Gerenciar.module.css";

export default function Gerenciar() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Erro ao buscar aulas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <p className={styles.loading}>Carregando aulas...</p>;

  return (
    <div className={styles.container}>
      <h1>Gerenciar Aulas</h1>

      {posts.length === 0 && (
        <p className={styles.empty}>Nenhuma aula encontrada.</p>
      )}

      {posts.map((p) => (
        <div key={p.id} className={styles.card}>
          <h3>{p.title}</h3>
          <p><strong>Autor:</strong> {p.author}</p>

          <div className={styles.actions}>
            <Link to={`/edit/${p.id}`}>
              <button className={styles.editBtn}>Editar</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
