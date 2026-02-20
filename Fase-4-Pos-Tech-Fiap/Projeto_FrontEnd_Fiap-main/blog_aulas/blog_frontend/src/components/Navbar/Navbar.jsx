import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    console.log("Navbar renderizou, user =", user);

    return (
        <div className={styles.navbar}>
            <h1>Blog de Aulas</h1>

            <ul>
                {/* Sempre visível */}
                <li>
                    <Link to="/">Home</Link>
                </li>

                {/* Só aparece se o usuário estiver logado */}
                {user && (
                    <>
                        <li>
                            <Link to="/create">Criar</Link>
                        </li>
                        <li>
                            <Link to="/admin">Admin</Link>
                        </li>
                        <li>
                            <Link to="/gerenciar">Gerenciar</Link>
                        </li>
                    </>
                )}

                {/* Só aparece se o usuário NÃO estiver logado */}
                {!user && (
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                )}
            </ul>
        </div>
    );
}
