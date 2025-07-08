// Fonctions d'appel API pour la gestion admin (users, vidéos)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://investeasy-backend.onrender.com/api';

import { mockUsers } from "./mock-users";
import { mockVideos } from "./mock-videos";

// USERS
type UserUpdate = { firstName?: string; lastName?: string; role?: string; isActive?: boolean };

export async function getUsers(
  { page = 1, limit = 50, search = '', role = '' }: { page?: number; limit?: number; search?: string; role?: string } = {},
  token: string
) {
  let users = mockUsers;
  if (search) {
    users = users.filter(u =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (role) {
    users = users.filter(u => u.role === role);
  }
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paged = users.slice((page - 1) * limit, page * limit);
  return {
    users: paged,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export async function updateUser(
  id: string,
  { firstName, lastName, role, isActive }: UserUpdate,
  token: string
) {
  const idx = mockUsers.findIndex(u => String(u.id) === id);
  if (idx !== -1) {
    mockUsers[idx] = {
      ...mockUsers[idx],
      firstName: firstName ?? mockUsers[idx].firstName,
      lastName: lastName ?? mockUsers[idx].lastName,
      role: role ?? mockUsers[idx].role,
      isActive: isActive ?? mockUsers[idx].isActive
    };
    return mockUsers[idx];
  }
  throw new Error('Utilisateur non trouvé');
}

export async function deleteUser(id: string, token: string) {
  const idx = mockUsers.findIndex(u => String(u.id) === id);
  if (idx !== -1) {
    mockUsers.splice(idx, 1);
    return { message: 'Utilisateur supprimé' };
  }
  throw new Error('Utilisateur non trouvé');
}

// VIDEOS
type VideoCreate = { title: string; description: string; url: string; thumbnail: string; category: string; duration: number; isPublished?: boolean };
type VideoUpdate = { title?: string; description?: string; url?: string; thumbnail?: string; category?: string; duration?: number; isPublished?: boolean };

export async function getAdminVideos(
  { page = 1, limit = 50, search = '', category = '' }: { page?: number; limit?: number; search?: string; category?: string } = {},
  token: string
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
  const totalItems = videos.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paged = videos.slice((page - 1) * limit, page * limit);
  return {
    videos: paged,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems
    }
  };
}

export async function createVideo(
  { title, description, url, thumbnail, category, duration, isPublished }: VideoCreate,
  token: string
) {
  const newId = mockVideos.length ? Math.max(...mockVideos.map(v => v.id)) + 1 : 1;
  const video = {
    id: newId,
    title,
    category,
    duration,
    views: 0,
    isPublished: !!isPublished,
    createdAt: new Date().toISOString(),
    url: url || '',
    thumbnail: thumbnail || ''
  };
  mockVideos.push(video);
  return video;
}

export async function updateVideo(
  id: string,
  { title, description, url, thumbnail, category, duration, isPublished }: VideoUpdate,
  token: string
) {
  const idx = mockVideos.findIndex(v => String(v.id) === id);
  if (idx !== -1) {
    mockVideos[idx] = {
      ...mockVideos[idx],
      title: title ?? mockVideos[idx].title,
      category: category ?? mockVideos[idx].category,
      duration: duration ?? mockVideos[idx].duration,
      isPublished: isPublished ?? mockVideos[idx].isPublished,
      url: url ?? mockVideos[idx].url,
      thumbnail: thumbnail ?? mockVideos[idx].thumbnail
    };
    return mockVideos[idx];
  }
  throw new Error('Vidéo non trouvée');
}

export async function deleteVideo(id: string, token: string) {
  const idx = mockVideos.findIndex(v => String(v.id) === id);
  if (idx !== -1) {
    mockVideos.splice(idx, 1);
    return { message: 'Vidéo supprimée' };
  }
  throw new Error('Vidéo non trouvée');
} 