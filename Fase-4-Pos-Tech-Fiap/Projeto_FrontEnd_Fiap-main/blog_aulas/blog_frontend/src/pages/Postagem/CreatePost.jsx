import styles from './CreatePost.module.css'

import React, { useState, useContext } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function CreatePost() {
  const { user } = useContext(AuthContext);
  console.log("Objeto User do Contexto:", user); 
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', author: user?.username || "" });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post(
        '/posts',
        { ...form, userId: user?.id, author:user?.username },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      navigate('/');
    } catch (err) {
      console.error('Erro ao criar post:', err.response?.data || err.message);
      alert('Erro ao criar post');
    }
  }

  return (
    <div className={styles.container}>
      <h1>Postar nova aula</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p>Tema da Aula:</p>
        <input
          className={styles.title}
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Título da Aula"
        />
        <p>Conteúdo da Aula:</p>
        <textarea
          className={styles.content}
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          placeholder="Conteúdo"
        />
        <button 
          className={styles.btn}
          type="submit">
            Criar
        </button>
      </form>
    </div>
  );
}

