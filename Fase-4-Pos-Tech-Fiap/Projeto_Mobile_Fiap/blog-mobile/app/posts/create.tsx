import { api } from '@/src/api/api';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { styles } from '../../src/theme/styles';

type QuizQuestionUI = {
  statement: string;
  options: string[];      // 5 textos
  correctIndex: number;   // 0..4
};

const makeEmptyQuestion = (): QuizQuestionUI => ({
  statement: '',
  options: ['', '', '', '', ''],
  correctIndex: 0,
});

export default function CreatePost() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ✅ Quiz opcional
  const [addQuiz, setAddQuiz] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestionUI[]>([makeEmptyQuestion()]);

  const canSubmitQuiz = useMemo(() => {
    if (!addQuiz) return true;

    // validação simples pra não enviar quiz vazio
    if (!questions.length) return false;

    for (const q of questions) {
      if (!q.statement.trim()) return false;
      // precisa ter pelo menos 2 opções preenchidas
      const filled = q.options.filter((o) => o.trim()).length;
      if (filled < 2) return false;
      // a correta precisa estar preenchida
      if (!q.options[q.correctIndex]?.trim()) return false;
    }

    return true;
  }, [addQuiz, questions]);

  const toggleAddQuiz = () => {
    setAddQuiz((prev) => {
      const next = !prev;
      // se ativar e estiver vazio, garante 1 pergunta
      if (next && questions.length === 0) setQuestions([makeEmptyQuestion()]);
      return next;
    });
  };

  const updateQuestionStatement = (idx: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], statement: text };
      return copy;
    });
  };

  const updateOption = (qIdx: number, optIdx: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = copy[qIdx];
      const newOptions = [...q.options];
      newOptions[optIdx] = text;
      copy[qIdx] = { ...q, options: newOptions };
      return copy;
    });
  };

  const setCorrect = (qIdx: number, optIdx: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], correctIndex: optIdx };
      return copy;
    });
  };

  const addQuestion = () => setQuestions((prev) => [...prev, makeEmptyQuestion()]);

  const removeQuestion = (qIdx: number) => {
    setQuestions((prev) => {
      const copy = prev.filter((_, i) => i !== qIdx);
      return copy.length ? copy : [makeEmptyQuestion()];
    });
  };

  const handleCreate = async () => {
    if (!title || !content) {
      return Alert.alert('Erro', 'Preencha título e conteúdo');
    }

    if (!token) {
      return Alert.alert('Erro', 'Usuário não autenticado');
    }

    if (!canSubmitQuiz) {
      return Alert.alert(
        'Quiz incompleto',
        'Preencha as perguntas, pelo menos 2 opções e marque uma alternativa correta.'
      );
    }

    // monta payload
    const payload: any = {
      title,
      content,
      // ⚠️ você NÃO precisa enviar author aqui — o backend já pega do token.
      // author: user?.username,
    };

    if (addQuiz) {
      payload.quiz = {
        questions: questions.map((q) => ({
          statement: q.statement.trim(),
          options: q.options
            .map((t, idx) => ({
              text: t.trim(),
              isCorrect: idx === q.correctIndex,
            }))
            // remove opções vazias pra não sujar o banco
            .filter((o: any) => o.text),
        })),
      };
    }

    try {
      await api.post('/api/posts', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Sucesso', addQuiz ? 'Post + Quiz criado!' : 'Post criado com sucesso!');
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Erro',
        error.response?.data?.error || error.response?.data?.message || 'Não foi possível criar o post'
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#d5e5f6ff' }}
      contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Criar Novo Post</Text>
        <Text style={styles.subtitle}>Preencha os campos abaixo para publicar</Text>

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
          style={[styles.input, { height: 180, textAlignVertical: 'top' }]}
        />

        {/* ✅ Toggle Quiz */}
        <Pressable
          onPress={toggleAddQuiz}
          style={{
            marginTop: 12,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: addQuiz ? '#34C759' : '#8e8e93',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}>
            {addQuiz ? 'Quiz ATIVADO ✅' : 'Adicionar Quiz (opcional)'}
          </Text>
        </Pressable>

        {/* ✅ Área do Quiz */}
        {addQuiz && (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.subtitle, { marginBottom: 8 }]}>
              Monte seu quiz (marque a alternativa correta)
            </Text>

            {questions.map((q, qIdx) => (
              <View
                key={qIdx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                  <Text style={{ fontWeight: '800', fontSize: 16 }}>
                    Pergunta {qIdx + 1}
                  </Text>

                  <Pressable onPress={() => removeQuestion(qIdx)}>
                    <Text style={{ color: '#ff3b30', fontWeight: '700' }}>Remover</Text>
                  </Pressable>
                </View>

                <TextInput
                  placeholder="Enunciado da pergunta"
                  value={q.statement}
                  onChangeText={(t) => updateQuestionStatement(qIdx, t)}
                  style={[styles.input, { marginTop: 10 }]}
                />

                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correctIndex === optIdx;
                  const label = ['A', 'B', 'C', 'D', 'E'][optIdx];

                  return (
                    <View key={optIdx} style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: '700', marginBottom: 6 }}>
                        Opção {label} {isCorrect ? '✅' : ''}
                      </Text>

                      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <TextInput
                          placeholder={`Texto da opção ${label}`}
                          value={opt}
                          onChangeText={(t) => updateOption(qIdx, optIdx, t)}
                          style={[styles.input, { flex: 1, marginTop: 0 }]}
                        />

                        <Pressable
                          onPress={() => setCorrect(qIdx, optIdx)}
                          style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 8,
                            backgroundColor: isCorrect ? '#34C759' : '#007aff',
                          }}
                        >
                          <Text style={{ color: 'white', fontWeight: '800' }}>
                            {isCorrect ? 'Correta' : 'Marcar'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}

            <Pressable
              onPress={addQuestion}
              style={{
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: '#007aff',
                marginTop: 4,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '800', textAlign: 'center' }}>
                + Adicionar Pergunta
              </Text>
            </Pressable>
          </View>
        )}

        <Pressable
          style={[
            styles.teacherButton,
            { marginTop: 16, opacity: canSubmitQuiz ? 1 : 0.6 },
          ]}
          onPress={handleCreate}
          disabled={!canSubmitQuiz}
        >
          <Text style={styles.teacherButtonText}>
            {addQuiz ? 'Criar Post + Quiz' : 'Criar Post'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
