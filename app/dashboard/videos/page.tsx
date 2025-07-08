"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getVideos, getCategories, likeVideo, viewVideo } from "@/lib/api/video";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Videos = () => {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<{ [id: string]: boolean }>({});
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('investeasy-token') || undefined;
        const data = await getCategories(token);
        setCategories(data.categories || []);
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('investeasy-token') || undefined;
        const data = await getVideos({ page, search, category }, token);
        setVideos(data.videos || []);
        setPagination(data.pagination || null);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des vidéos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [page, search, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleLike = async (videoId: string) => {
    const token = localStorage.getItem('investeasy-token') || '';
    if (!token) return;
    setLikeLoading(videoId);
    try {
      const res = await likeVideo(videoId, token);
      setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, likes: res.likes } : v));
      setLikedVideos((prev) => ({ ...prev, [videoId]: res.isLiked }));
    } catch {}
    setLikeLoading(null);
  };

  const handleView = async (videoId: string) => {
    const token = localStorage.getItem('investeasy-token') || '';
    setViewLoading(videoId);
    try {
      const res = await viewVideo(videoId, token);
      setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, views: res.views } : v));
    } catch {}
    setViewLoading(null);
  };

  const openVideoModal = (video: any) => {
    setSelectedVideo(video);
    handleView(video.id);
  };

  const closeVideoModal = () => setSelectedVideo(null);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermédiaire":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Avancé":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Vidéos Éducatives</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Apprenez les bases de l'investissement grâce à notre collection de vidéos éducatives 
          créées spécialement pour les investisseurs sénégalais.
        </p>
      </div>
      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
        <input
          type="text"
          placeholder="Rechercher une vidéo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-md px-4 py-2 w-full md:w-64"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="border rounded-md px-4 py-2 w-full md:w-48"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-md">Rechercher</button>
      </form>
      {/* Videos Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {videos.map((video) => (
              <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden flex items-center justify-center">
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full"
                    >
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={getLevelColor(video.category || video.level)}>
                      {video.category || video.level}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {video.title}
                  </CardTitle>
                  <CardDescription>
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {video.duration ? `${video.duration} min` : '--'}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {video.views} vues
                      </div>
                      <button
                        className={`flex items-center gap-1 px-2 py-1 rounded-md border ${likedVideos[video.id] ? 'bg-primary text-primary-foreground' : ''}`}
                        disabled={likeLoading === video.id || !isAuthenticated}
                        onClick={() => handleLike(video.id)}
                      >
                        {likeLoading === video.id ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          <>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                            {video.likes || 0}
                          </>
                        )}
                      </button>
                    </div>
                    <button
                      className="flex items-center text-primary px-2 py-1 border rounded-md"
                      disabled={viewLoading === video.id}
                      onClick={() => openVideoModal(video)}
                    >
                      {viewLoading === video.id ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      Regarder
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Pagination */}
          {pagination && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                className="px-4 py-2 rounded-md border disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Précédent
              </button>
              <span>Page {pagination.currentPage} / {pagination.totalPages}</span>
              <button
                className="px-4 py-2 rounded-md border disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={closeVideoModal}>
        <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
          {selectedVideo && (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 bg-black aspect-video relative flex items-center justify-center">
                <video
                  src={selectedVideo.url}
                  controls
                  className="w-full h-full min-h-[240px] md:min-h-[360px]"
                >
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4 min-w-[280px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-2">{selectedVideo.title}</DialogTitle>
                </DialogHeader>
                <div className="text-muted-foreground mb-2 text-base">{selectedVideo.description}</div>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
                  <span className="flex items-center"><Eye className="h-4 w-4 mr-1" />{selectedVideo.views} vues</span>
                  <span className="flex items-center"><svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>{selectedVideo.likes || 0} likes</span>
                  <span className="flex items-center"><Clock className="h-4 w-4 mr-1" />{selectedVideo.duration ? `${selectedVideo.duration} min` : '--'}</span>
                  <Badge className={getLevelColor(selectedVideo.category || selectedVideo.level)}>{selectedVideo.category || selectedVideo.level}</Badge>
                </div>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border w-fit ${likedVideos[selectedVideo.id] ? 'bg-primary text-primary-foreground' : ''}`}
                  disabled={likeLoading === selectedVideo.id || !isAuthenticated}
                  onClick={() => handleLike(selectedVideo.id)}
                >
                  {likeLoading === selectedVideo.id ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                      {likedVideos[selectedVideo.id] ? 'Retirer le like' : 'Aimer'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Videos; 