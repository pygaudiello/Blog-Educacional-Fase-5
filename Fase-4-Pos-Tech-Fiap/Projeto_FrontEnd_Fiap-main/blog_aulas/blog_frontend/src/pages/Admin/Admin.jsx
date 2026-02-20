import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Admin.module.css";

const Admin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return <p className={styles.loading}>Carregando...</p>;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <h1>Painel do Admin</h1>
      <p className={styles.subtitle}>
        Gerencie suas aulas e configurações do sistema
      </p>

      <div className={styles.card}>
        <p>
          <span className={styles.username}>{user.name}</span>
        </p>
        <p>{user.email}</p>
      </div>

      <div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
};

export default Admin;
