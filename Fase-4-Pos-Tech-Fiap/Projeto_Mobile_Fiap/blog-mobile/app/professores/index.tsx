import { api } from '@/src/api/api';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { styles } from '../../src/theme/styles';

type Professor = {
  id: number;
  username: string;
  role: string;
};

export default function ProfessoresPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Listar professores
  const fetchProfessores = useCallback(async () => {
    try {
      const res = await api.get('/api/users/teachers', authHeader);
      setProfessores(res.data);
    } catch {
      Alert.alert('Erro', 'Erro ao carregar professores');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfessores();
  }, [fetchProfessores]);

  // ---------- CRIAR ----------
  const handleCreate = async () => {
    if (!username || !password) return;

    try {
      const res = await api.post(
        `/api/users`,
        { username, password, role: 'teacher' },
        authHeader
      );

      setProfessores((prev) => [...prev, res.data]);
      setIsCreating(false);
      setUsername('');
      setPassword('');
    } catch {
      Alert.alert('Erro', 'Erro ao criar professor');
    }
  };

  // Edição
  const handleEdit = async () => {
    if (!selectedProfessor) return;

    try {
      const res = await api.put(
        `/api/users/${selectedProfessor.id}`,
        { username, password },
        authHeader
      );

      setProfessores((prev) =>
        prev.map((p) => (p.id === selectedProfessor.id ? res.data : p))
      );

      setSelectedProfessor(null);
      setUsername('');
      setPassword('');
    } catch {
      Alert.alert('Erro', 'Erro ao editar professor');
    }
  };

  // Deletar
  const handleDelete = async () => {
    if (!selectedProfessor) return;

    try {
      console.log('🗑️ DELETANDO ID:', selectedProfessor.id);

      await api.delete(
        `/api/users/${selectedProfessor.id}`,
        authHeader
      );

      setProfessores((prev) =>
        prev.filter((p) => p.id !== selectedProfessor.id)
      );

      setSelectedProfessor(null);
      setUsername('');
      setPassword('');

      Alert.alert('Sucesso', 'Professor deletado com sucesso');
    } catch (err: any) {
      console.error('ERRO DE DELETAR', err?.response?.data || err);
      Alert.alert(
        'Erro',
        err?.response?.data?.error || 'Erro ao deletar professor'
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#d5e5f6ff' }}>
      {!selectedProfessor && !isCreating ? (
        <>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 16,
            backgroundColor: '#d5e5f6ff'
          }}>
            <Pressable 
              onPress={() => router.back()} 
              style={{ 
                paddingVertical: 8, 
                paddingHorizontal: 12, 
                backgroundColor: '#007aff', 
                borderRadius: 6 
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Voltar</Text>
            </Pressable>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.title}>Professores</Text>
            </View>

            <Pressable 
              onPress={() => setIsCreating(true)}
              style={{ 
                paddingVertical: 8, 
                paddingHorizontal: 12, 
                backgroundColor: '#007aff', 
                borderRadius: 6 
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Novo</Text>
            </Pressable>
          </View>

          <FlatList
            data={professores}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedProfessor(item);
                  setUsername(item.username);
                  setPassword('');
                }}
                style={{ marginBottom: 12 }}
              >
                <View style={[
                  styles.postCard2, 
                  { 
                    width: '100%',
                    alignSelf: 'stretch',
                  }
                ]}>
                  <Text style={styles.postTitle}>{item.username}</Text>
                  <Text style={styles.postAuthor}>Função: Professor</Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center', 
                paddingVertical: 40 
              }}>
                <Text style={{ fontSize: 16, color: '#666' }}>
                  Nenhum professor encontrado
                </Text>
              </View>
            }
          />
        </>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            flexGrow: 1,
            backgroundColor: '#d5e5f6ff',
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ 
            ...styles.cardContainer, 
            width: '100%', 
            maxWidth: 500,
            alignSelf: 'center' 
          }}>

            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 12 
            }}>
              <Text
                style={{ ...styles.title, flexShrink: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {isCreating
                  ? 'Novo Professor'
                  : `Editando: ${selectedProfessor?.username}`}
              </Text>

              {!isCreating && (
                <Pressable onPress={handleDelete} style={{ padding: 12 }}>
                  <MaterialIcons name="delete" size={28} color="#ff3b30" />
                </Pressable>
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Usuário"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder={isCreating ? 'Senha' : 'Nova senha (opcional)'}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              style={[styles.teacherButton, { marginTop: 12 }]}
              onPress={isCreating ? handleCreate : handleEdit}
            >
              <Text style={styles.teacherButtonText}>
                {isCreating ? 'Salvar' : 'Salvar alterações'}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.teacherButton, 
                { marginTop: 12, backgroundColor: '#ccc' }
              ]}
              onPress={() => {
                setSelectedProfessor(null);
                setIsCreating(false);
                setUsername('');
                setPassword('');
              }}
            >
              <Text style={styles.teacherButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}