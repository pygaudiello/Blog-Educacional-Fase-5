import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de fade out após 2.5 segundos
    const fadeOutTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }, 2500);

    // Redireciona após a animação completar
    const redirectTimer = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <MaterialIcons name="school" size={80} color="#007aff" style={styles.icon} />
      
      <Text style={styles.welcomeTitle}>Bem-vindo ao</Text>
      <Text style={styles.appTitle}>EduPosts Pro</Text>
      
      <Text style={styles.subtitle}>
        Do post ao progresso: publique conteúdos, aplique quizzes e acompanhe o aprendizado em tempo real.
      </Text>
      
      <View style={styles.divider} />
      
      <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
      <Text style={styles.loadingText}>
        Preparando sua experiência...
      </Text>
      
      <Text style={styles.footer}>
        Tech Challenge FIAP • 2026
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 30,
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 22,
    color: '#666',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#007aff',
    marginBottom: 20,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 122, 255, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 30,
    marginBottom: 40,
    fontStyle: 'italic',
  },
  divider: {
    width: '60%',
    height: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 40,
    borderRadius: 1,
  },
  loader: {
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: '#aaa',
    letterSpacing: 0.5,
  },
});