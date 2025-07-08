// Fonctions d'appel API pour les vidéos

import { mockVideos } from "./mock-videos";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://investeasy-backend.onrender.com/api';

export async function getVideos(
  { page = 1, limit = 10, category = '', search = '', sort = 'newest' } = {}, token?: string
) {
  let videos = mockVideos;
  if (search) {
    videos = videos.filter(v =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (category) {
    videos = videos.filter(v => v.category === category);
  }
  // Optionally sort
  if (sort === 'newest') {
    videos = videos.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'oldest') {
    videos = videos.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sort === 'popular') {
    videos = videos.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
  }
  const totalItems = videos.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paged = videos.slice((page - 1) * limit, page * limit);
  return {
    videos: paged,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export async function getVideo(id: string, token?: string) {
  const video = mockVideos.find(v => String(v.id) === String(id));
  if (!video) throw new Error('Vidéo non trouvée');
  return video;
}

export async function likeVideo(id: string, token: string) {
  const idx = mockVideos.findIndex(v => String(v.id) === String(id));
  if (idx !== -1) {
    if (!mockVideos[idx].likes) mockVideos[idx].likes = 0;
    if (!mockVideos[idx].isLiked) mockVideos[idx].isLiked = false;
    mockVideos[idx].isLiked = !mockVideos[idx].isLiked;
    mockVideos[idx].likes += mockVideos[idx].isLiked ? 1 : -1;
    return { message: 'Like toggled', likes: mockVideos[idx].likes, isLiked: mockVideos[idx].isLiked };
  }
  throw new Error('Vidéo non trouvée');
}

export async function viewVideo(id: string, token: string) {
  const idx = mockVideos.findIndex(v => String(v.id) === String(id));
  if (idx !== -1) {
    if (!mockVideos[idx].views) mockVideos[idx].views = 0;
    mockVideos[idx].views += 1;
    return { message: 'View recorded', views: mockVideos[idx].views };
  }
  throw new Error('Vidéo non trouvée');
}

export async function getCategories(token?: string) {
  // Extraire les catégories uniques des vidéos mockées
  const categories = Array.from(new Set(mockVideos.map(v => v.category))).map((cat, i) => ({
    id: i + 1,
    name: cat,
    description: '',
    videoCount: mockVideos.filter(v => v.category === cat).length
  }));
  return { categories };
} 