import { api } from './api';

export async function getPosts(q?: string) {
  const response = await api.get('/api/posts', {
    params: q ? { q } : {},
  });

  return response.data;
}
