import styles from './Login.module.css';

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  async function handleSubmit(e) {
  e.preventDefault();
  try {
    await login(form.username, form.password);
    navigate("/");
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Usuário ou senha inválidos";
    alert(errorMessage);
    console.error("Erro login:", err.response?.data);
  }
}

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="text"
        placeholder="Usuário"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Senha"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

