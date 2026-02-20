import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../src/api/api';

import { useAuth } from '../src/contexts/AuthContext';
import { colors } from '../src/theme/colors';
import { styles } from '../src/theme/styles';

type JwtPayload = {
  id: number;
  username: string;
  role: 'teacher' | 'student';
};

export default function Login() {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post(
        '/api/auth/login',
        {
          username,
          password,
        }
      );


      const { token } = response.data;

      const decoded = jwtDecode<JwtPayload>(token);
      console.log(decoded);
      
      login(token, {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      });

      // redireciona conforme o papel
        if (decoded.role === 'teacher') {
        router.replace('/posts');
        return; // evita cair no /posts por engano
        }

        router.replace('/posts');

    } catch {
      setError('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }

    
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>EduPosts Pro</Text>

        <Text style={styles.subtitle}>
          Do post ao progresso: publique conteúdos, aplique quizzes e acompanhe o aprendizado em tempo real.
        </Text>

        <TextInput
          placeholder="Usuário"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          <View style={styles.button}>
            <Button
              title="Entrar"
              color={colors.primary}
              onPress={handleLogin}
            />
          </View>
        )}
      </View>
    </View>
  );
}
