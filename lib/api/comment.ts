// Fonctions d'appel API pour les commentaires

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://investeasy-backend.onrender.com/api';

export async function getComments(
  { page = 1, limit = 20, videoId = null }: { page?: number; limit?: number; videoId?: string | null } = {},
  token?: string
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (videoId) params.append('videoId', videoId);
  const res = await fetch(`${API_URL}/comments?${params.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des commentaires');
  return res.json();
}

export async function createComment(
  { text, videoId, parentId }: { text: string; videoId?: string; parentId?: string },
  token: string
) {
  const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, videoId, parentId }),
  });
  if (!res.ok) throw new Error('Erreur lors de la création du commentaire');
  return res.json();
}

export async function updateComment(
  id: string,
  { text }: { text: string },
  token: string
) {
  const res = await fetch(`${API_URL}/comments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Erreur lors de la modification du commentaire');
  return res.json();
}

export async function deleteComment(id: string, token: string) {
  const res = await fetch(`${API_URL}/comments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression du commentaire');
  return res.json();
}

export async function likeComment(id: string, token: string) {
  const res = await fetch(`${API_URL}/comments/${id}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Erreur lors du like du commentaire');
  return res.json();
}

export async function getReplies(
  id: string,
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
  token?: string
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(`${API_URL}/comments/${id}/replies?${params.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des réponses');
  return res.json();
} 