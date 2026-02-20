import { createContext, useEffect, useState } from "react";
import api from "../api/api"; // Importação NECESSÁRIA

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // O linter pode reclamar de 'user' e 'setUser' se não reconhecer o uso no return
  const [user, setUser] = useState(null); 
  
  // RESTAURADO: CRÍTICO para carregar o usuário do localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ Usuário carregado do localStorage:', userData.username);
      } catch (error) {
        console.log('❌ Erro ao carregar usuário:', error);
        // Limpa dados inválidos
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // O linter reclama de 'login' não usado fora daqui, mas é exportado via Context
 const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const userData = response.data;
      
      // Salva no localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify({
        username: username,
        name: username,
        token: userData.token
      }));
      
      setUser({
        username: username,
        name: username,
        token: userData.token
      });
      
      console.log('✅ Login realizado:', username);
      return userData;
    } catch (error) {
      console.log('❌ Erro no login:', error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log('✅ Logout realizado');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};