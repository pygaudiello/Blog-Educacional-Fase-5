import { api } from '@/src/api/api';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

import { styles } from '../../src/theme/styles';

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
};

export default function PostsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

const fetchPosts = async () => {
  try {
    const res = await api.get(`/api/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPosts(res.data);
    setFilteredPosts(res.data);
  } catch (error) {
    console.error(error);
  }
};

  // Recarrega posts
  useFocusEffect(
  useCallback(() => {
    if (token) {
      fetchPosts();
    }
  }, [token])
);


  // Filtra posts
  useEffect(() => {
    setFilteredPosts(
      posts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.author.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, posts]);

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TextInput
          placeholder="Buscar posts..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {user?.role === 'teacher' && (
          <View style={styles.teacherControls}>
            <Pressable
              style={styles.teacherButton}
              onPress={() => router.push('/posts/create')}
            >
              <Text style={styles.teacherButtonText}>Criar Post</Text>
            </Pressable>

            <Pressable
              style={styles.teacherButton}
              onPress={() => router.push('/edit-post/1')} // exemplo: editar post 1
            >
              <Text style={styles.teacherButtonText}>Editar Posts</Text>
            </Pressable>

            <Pressable
            style={styles.teacherButton}
            onPress={() => router.push('/professores' as any)}
            >
            <Text style={styles.teacherButtonText}>Gerenciamento de Professores</Text>
            </Pressable>

            <Pressable
            style={styles.teacherButton}
            onPress={() => router.push('/alunos' as any)}
            >
            <Text style={styles.teacherButtonText}>Gerenciamento de Alunos</Text>
            </Pressable>

          </View>
        )}
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/posts/${item.id}`)}>
            <View style={styles.postCard}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postAuthor}>{item.author}</Text>
              <Text numberOfLines={2} style={styles.postDescription}>
                {item.content}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
