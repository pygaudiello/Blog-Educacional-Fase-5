import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import styles from "./EditPost.module.css";

export default function EditPost() {
  const { id } = useParams(); // pega o id da aula pela URL
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        content: "",
        author: ""
    });

    // Carregar os dados da aula pelo id
    useEffect(() => {
        async function fetchPost() {
        try {
            const res = await api.get(`/posts/${id}`);
            setForm(res.data);
        } catch (err) {
            console.error("Erro ao buscar aula:", err);
        }
        }
        fetchPost();
    }, [id]);

    // Atualizar aula
    async function handleUpdate(e) {
        e.preventDefault();
        try {
        await api.put(`/posts/${id}`, form);
        alert("Aula atualizada com sucesso!");
        navigate("/");
        } catch (err) {
        console.error("Erro ao atualizar aula:", err);
        }
    }

    // Deletar aula
    async function handleDelete() {
        if (window.confirm("Tem certeza que deseja deletar essa aula?")) {
        try {
            await api.delete(`/posts/${id}`);
            alert("Aula deletada com sucesso!");
            navigate("/");
        } catch (err) {
            console.error("Erro ao deletar aula:", err);
        }
        }
    }

    return (
        <form onSubmit={handleUpdate} className={styles.form}>
        <h2>Editar Aula</h2>
        <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Título"
        />
        <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Conteúdo"
        />
        <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            placeholder="Autor"
        />

        <button type="submit">Salvar alterações</button>
        <button type="button" onClick={handleDelete} style={{ color: "red" }}>
            Deletar aula
        </button>
        </form>
    );
}
