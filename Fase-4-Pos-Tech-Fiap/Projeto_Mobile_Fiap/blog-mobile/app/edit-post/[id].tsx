import { api } from '@/src/api/api';
import { MaterialIcons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { styles } from '../../src/theme/styles';

type QuizOption = {
  id: number;
  text: string;
  isCorrect?: boolean;
};

type QuizQuestion = {
  id: number;
  statement: string;
  Options?: QuizOption[];
};

type Quiz = {
  id: number;
  Questions?: QuizQuestion[];
};

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  Quiz?: Quiz | null;
};


export default function EditPostsPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);


  // verificar token
  useEffect(() => {
    console.log('=== DEBUG TOKEN ===');
    console.log('Token existe?', !!token);
    console.log('Token (primeiros 20 chars):', token ? token.substring(0, 20) + '...' : 'Nenhum');
    console.log('Usuario:', user);
    console.log('Role:', user?.role);
  }, [token, user]);

  // posts
  const fetchPosts = useCallback(async () => {
    try {
      console.log('Buscando posts...');
      
      const res = await api.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Posts encontrados:', res.data.length);
      setPosts(res.data);
    } catch (err) {
      console.error('Erro ao buscar posts:', isAxiosError(err) ? err.response?.data || err.message : err);
      Alert.alert('Erro', 'Não foi possível carregar os posts');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleEditSelect = async (post: Post) => {
  try {
    setLoading(true);

    const res = await api.get(`/api/posts/${post.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fullPost: Post = res.data;

    setEditingPost(fullPost);
    setTitle(fullPost.title);
    setContent(fullPost.content);

    // quiz (se existir)
    const qz = fullPost.Quiz;
    setQuizId(qz?.id ?? null);
    setQuizQuestions(qz?.Questions ?? []);

    setShowDeleteConfirm(false);
  } catch (err) {
    console.error(err);
    Alert.alert('Erro', 'Não foi possível carregar o post para edição');
  } finally {
    setLoading(false);
  }
  };

  const updateQuestionText = (questionId: number, text: string) => {
  setQuizQuestions((prev) =>
    prev.map((q) => (q.id === questionId ? { ...q, statement: text } : q))
  );
  };

  const updateOptionText = (questionId: number, optionId: number, text: string) => {
    setQuizQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          Options: (q.Options ?? []).map((o) => (o.id === optionId ? { ...o, text } : o)),
        };
      })
    );
  };

  const handleUpdate = async () => {
    if (!editingPost) return;
    if (!title || !content) return Alert.alert('Erro', 'Preencha todos os campos');

    try {
      // atualiza post
      const res = await api.put(
        `/api/posts/${editingPost.id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? res.data : p)));

      // atualiza textos do quiz (se existir)
      if (quizId && quizQuestions.length > 0) {
        await api.put(
          `/api/quizzes/${quizId}/texts`,
          {
            questions: quizQuestions.map((q) => ({
              id: q.id,
              statement: q.statement,
              options: (q.Options ?? []).map((o) => ({
                id: o.id,
                text: o.text,
              })),
            })),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      Alert.alert('Sucesso', quizId ? 'Post e Quiz atualizados!' : 'Post atualizado!');
      setEditingPost(null);
      setTitle('');
      setContent('');
      setQuizId(null);
      setQuizQuestions([]);
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      Alert.alert('Erro', 'Não foi possível atualizar o post/quiz');
    }
  };

  const handleDeleteClick = () => {
    if (!editingPost) return;
    
    console.log('=== MOSTRANDO CONFIRMAÇÃO DE DELEÇÃO ===');
    console.log('Post ID:', editingPost.id);
    console.log('Título:', editingPost.title);
    
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!editingPost) return;
    
    console.log('=== EXECUTANDO DELEÇÃO ===');
    console.log('Tentando deletar post ID:', editingPost.id);
    
    try {
      const response = await api.delete(
        `/api/posts/${editingPost.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('=== RESPOSTA DO BACKEND ===');
      console.log('Status:', response.status);
      console.log('Dados:', response.data);
      
      if (response.status === 200) {
        setPosts(prev => prev.filter(p => p.id !== editingPost.id));
        
        // reseta os estados de edição e volta para a lista
        setEditingPost(null);
        setTitle('');
        setContent('');
        setShowDeleteConfirm(false);

        Alert.alert('Sucesso', 'Post deletado com sucesso!');
      
        fetchPosts();
      }
      
    } catch (err: any) {
      console.error('=== ERRO NA DELEÇÃO ===');
      console.error('Mensagem:', err.message);
      
      if (isAxiosError(err)) {
        console.error('Status:', err.response?.status);
        console.error('Dados:', err.response?.data);
        
        if (err.response?.status === 404) {
          Alert.alert('Não encontrado', 'Este post já foi deletado.');
          setPosts(prev => prev.filter(p => p.id !== editingPost.id));
          setEditingPost(null);
          setTitle('');
          setContent('');
          setShowDeleteConfirm(false);
        } else {
          Alert.alert('Erro', `Erro ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
        }
      } else {
        Alert.alert('Erro', 'Erro desconhecido: ' + err.message);
      }
      
      fetchPosts();
    }
  };

  const cancelDelete = () => {
    console.log('Deleção cancelada pelo usuário');
    setShowDeleteConfirm(false);
  };

  const handleCancel = () => {
    setEditingPost(null);
    setTitle('');
    setContent('');
    setShowDeleteConfirm(false);
  };

  // teste direto da Api, jaja comento
  const testApiConnection = async () => {
    try {
      console.log('=== TESTANDO CONEXÃO COM API ===');
      
      const testResponse = await api.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('API está acessível. Posts:', testResponse.data.length);
      
      if (editingPost) {
        try {
          const postResponse = await api.get(`/api/posts/${editingPost.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Post encontrado:', postResponse.data.title);
        } catch (postErr: any) {
          console.log('Post não encontrado ou erro:', postErr.message);
        }
      }
      
    } catch (error: any) {
      console.error('Erro ao testar API:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando posts...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#d5e5f6ff' }}
      contentContainerStyle={{
        paddingVertical: 20,
        paddingHorizontal: 16,
        flexGrow: 1
      }}
      keyboardShouldPersistTaps="handled"
    >
      {!editingPost ? (
        <>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            justifyContent: 'space-between'
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
            
            <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 12 }}>
              <Text style={styles.title}>Editar Posts</Text>
            </View>
            
            <Pressable
              onPress={() => {
                setLoading(true);
                fetchPosts();
              }}
              style={{
                padding: 8,
                borderRadius: 6
              }}
            >
              <MaterialIcons name="refresh" size={24} color="#007aff" />
            </Pressable>
          </View>

          {posts.length === 0 ? (
            <View style={{
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 50 
            }}>
              <Text style={{ fontSize: 16, color: '#666' }}>
                Nenhum post encontrado
              </Text>
              <Pressable
                onPress={() => {
                  setLoading(true);
                  fetchPosts();
                }}
                style={{ 
                  marginTop: 16,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: '#007aff',
                  borderRadius: 6
                }}
              >
                <Text style={{ color: 'white' }}>Recarregar</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable 
                  onPress={() => handleEditSelect(item)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.8 : 1
                  })}
                >
                  <View style={styles.postCard}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postAuthor}>Autor: {item.author}</Text>
                    <Text numberOfLines={2} style={styles.postDescription}>
                      {item.content}
                    </Text>
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'flex-end',
                      marginTop: 8 
                    }}>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#007aff',
                        fontStyle: 'italic' 
                      }}>
                        Clique para editar
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          )}
        </>
      ) : (
        <View style={{ 
          ...styles.cardContainer, 
          alignSelf: 'center', 
          width: '100%', 
          maxWidth: 500,
          marginTop: 20 
        }}>

          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: 12 
          }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ ...styles.title, flexShrink: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Editando: {editingPost.title}
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: '#666',
                marginTop: 4 
              }}>
                Autor: {editingPost.author}
              </Text>
            </View>

            <Pressable
              onPress={handleDeleteClick}
              style={{ 
                padding: 12,
                marginLeft: 12 
              }}
            >
              <MaterialIcons name="delete-outline" size={28} color="#ff3b30" />
            </Pressable>
          </View>

          {showDeleteConfirm && (
            <View style={{
              backgroundColor: '#ffebee',
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#ffcdd2'
            }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: 'bold',
                marginBottom: 12,
                color: '#c62828'
              }}>
                Confirmar exclusão
              </Text>
              <Text style={{ 
                fontSize: 14,
                marginBottom: 16,
                color: '#333'
              }}>
                Tem certeza que deseja excluir o post&quot;{editingPost?.title}&quot;?
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'flex-end',
                gap: 12
              }}>
                <Pressable
                  onPress={cancelDelete}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    backgroundColor: '#757575',
                    borderRadius: 4
                  }}
                >
                  <Text style={{ color: 'white' }}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={confirmDelete}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    backgroundColor: '#d32f2f',
                    borderRadius: 4
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Text style={styles.subtitle}>Altere os campos abaixo e salve</Text>

          <TextInput 
            placeholder="Título" 
            value={title} 
            onChangeText={setTitle} 
            style={styles.input} 
          />
          
          <TextInput
            placeholder="Conteúdo"
            value={content}
            onChangeText={setContent}
            multiline
            style={[styles.input, { 
              height: 180, 
              textAlignVertical: 'top',
              paddingTop: 12 
            }]}
          />

          {quizId && quizQuestions.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.subtitle, { fontWeight: '800', marginBottom: 8 }]}>
              Editar Quiz
            </Text>

            <Text style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
              ⚠️ Observação: você pode alterar apenas os textos. A alternativa correta marcada no cadastro não muda,
              para não afetar alunos que já responderam.
            </Text>

            {quizQuestions.map((q, idx) => (
              <View
                key={q.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#e8e8e8',
                }}
              >
                <Text style={{ fontWeight: '800', marginBottom: 8 }}>
                  Pergunta {idx + 1}
                </Text>

                <TextInput
                  value={q.statement}
                  onChangeText={(t) => updateQuestionText(q.id, t)}
                  placeholder="Enunciado"
                  style={styles.input}
                />

                {(q.Options ?? []).map((opt, optIdx) => (
                  <View key={opt.id} style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: '700', marginBottom: 6 }}>
                      Alternativa {['A', 'B', 'C', 'D', 'E'][optIdx] ?? `${optIdx + 1}`}
                      {opt.isCorrect ? ' ✅ (correta — não muda)' : ''}
                    </Text>

                    <TextInput
                      value={opt.text}
                      onChangeText={(t) => updateOptionText(q.id, opt.id, t)}
                      placeholder="Texto da alternativa"
                      style={styles.input}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16
          }}>
            <Pressable
              style={[
                styles.teacherButton,
                {
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: '#007aff'
                }
              ]}
              onPress={handleUpdate}
            >
              <Text style={styles.teacherButtonText}>Salvar</Text>
            </Pressable>

            <Pressable
              style={[
                styles.teacherButton,
                {
                  flex: 1,
                  marginLeft: 8,
                  backgroundColor: '#8e8e93'
                }
              ]}
              onPress={handleCancel}
            >
              <Text style={styles.teacherButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// coloque um f se vc viu que eu desisti de colocar a estilização em uma file só
// f