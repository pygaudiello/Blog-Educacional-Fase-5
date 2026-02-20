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

type Aluno = {
  id: number;
  username: string;
  role: string;
};

export default function AlunosPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Listar os alunos
  const fetchAlunos = useCallback(async () => {
    try {
      const res = await api.get('/api/users/students', authHeader);
      setAlunos(res.data);
    } catch (err: any) {
      console.error('ERRO AO BUSCAR ALUNOS:', err?.response?.data || err);
      Alert.alert('Erro', 'Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  // Criar os alunos
  const handleCreate = async () => {
    if (!username || !password) return;

    try {
      const res = await api.post(
        `/api/users`,
        { username, password, role: 'student' },
        authHeader
      );

      setAlunos((prev) => [...prev, res.data]);
      setIsCreating(false);
      setUsername('');
      setPassword('');
      
      Alert.alert('Sucesso', 'Aluno criado com sucesso');
    } catch (err: any) {
      console.error('ERRO AO CRIAR ALUNO:', err?.response?.data || err);
      Alert.alert(
        'Erro',
        err?.response?.data?.error || 'Erro ao criar aluno'
      );
    }
  };

  // Edição de Aluno
  const handleEdit = async () => {
    if (!selectedAluno) return;

    try {
      const res = await api.put(
        `/api/users/${selectedAluno.id}`,
        { username, password },
        authHeader
      );

      setAlunos((prev) =>
        prev.map((p) => (p.id === selectedAluno.id ? res.data : p))
      );

      setSelectedAluno(null);
      setUsername('');
      setPassword('');
      
      Alert.alert('Sucesso', 'Aluno atualizado com sucesso');
    } catch (err: any) {
      console.error('ERRO AO EDITAR ALUNO:', err?.response?.data || err);
      Alert.alert(
        'Erro',
        err?.response?.data?.error || 'Erro ao editar aluno'
      );
    }
  };

  // Apagar o aluno
  const handleDelete = async () => {
    if (!selectedAluno) return;

    try {
      console.log('DELETANDO ALUNO ID:', selectedAluno.id);

      await api.delete(
        `/api/users/${selectedAluno.id}`,
        authHeader
      );

      setAlunos((prev) =>
        prev.filter((p) => p.id !== selectedAluno.id)
      );

      setSelectedAluno(null);
      setUsername('');
      setPassword('');

      Alert.alert('Sucesso', 'Aluno deletado com sucesso');
    } catch (err: any) {
      console.error('ERRO DELETAR ALUNO', err?.response?.data || err);
      Alert.alert(
        'Erro',
        err?.response?.data?.error || 'Erro ao deletar aluno'
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#d5e5f6ff' }}>
      {!selectedAluno && !isCreating ? (
        <>
          {/* HEADER */}
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
              <Text style={styles.title}>Alunos</Text>
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

          {/* LISTA DE ALUNOS */}
          <FlatList
            data={alunos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedAluno(item);
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
                  <Text style={styles.postAuthor}>Função: Aluno</Text>
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
                  Nenhum aluno encontrado
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
            {/* HEADER com título e lixeira */}
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
                  ? 'Novo Aluno'
                  : `Editando: ${selectedAluno?.username}`}
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
                setSelectedAluno(null);
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