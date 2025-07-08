"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MessageCircle, Send, Clock, Loader2 } from "lucide-react";
import { getComments, createComment, likeComment, updateComment, deleteComment, getReplies } from "@/lib/api/comment";
import { User } from "@/types/user";

interface Comment {
  id: string;
  userId: string;
  user: User;
  text: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

const Forum = () => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replies, setReplies] = useState<{ [parentId: string]: any[] }>({});
  const [repliesLoading, setRepliesLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setFetching(true);
      try {
        const token = localStorage.getItem('investeasy-token') || undefined;
        const data = await getComments({ page, limit: 10 }, token);
        setComments(data.comments || []);
        setPagination(data.pagination || null);
      } catch (err: any) {
        toast.error(err.message || 'Erreur lors du chargement des commentaires');
      } finally {
        setFetching(false);
      }
    };
    fetchComments();
  }, [page]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Veuillez écrire votre commentaire avant de l'envoyer");
      return;
    }
    if (newComment.length > 500) {
      toast.error("Le commentaire ne peut pas dépasser 500 caractères");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      const res = await createComment({ text: newComment }, token);
      setComments([res, ...comments]);
      setNewComment("");
      toast.success("Votre commentaire a été ajouté avec succès");
    } catch (error: any) {
      toast.error(error.message || "Impossible de publier le commentaire");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    const token = localStorage.getItem('investeasy-token') || '';
    if (!token) return;
    setLikeLoading(commentId);
    try {
      const res = await likeComment(commentId, token);
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: res.likes, isLiked: res.isLiked } : c));
    } catch {}
    setLikeLoading(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (user: User) => {
    return user.email.charAt(0).toUpperCase();
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editText.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }
    setEditLoading(true);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      const res = await updateComment(commentId, { text: editText }, token);
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, text: res.text } : c));
      setEditingId(null);
      setEditText("");
      toast.success("Commentaire modifié");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la modification");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    setDeleteLoading(commentId);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Commentaire supprimé");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingId(commentId);
    setReplyText("");
    if (!replies[commentId]) fetchReplies(commentId);
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim()) {
      toast.error("La réponse ne peut pas être vide");
      return;
    }
    setReplyLoading(true);
    try {
      const token = localStorage.getItem('investeasy-token') || '';
      const res = await createComment({ text: replyText, parentId }, token);
      setReplies((prev) => ({ ...prev, [parentId]: [res, ...(prev[parentId] || [])] }));
      setReplyText("");
      setReplyingId(null);
      toast.success("Réponse ajoutée");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la réponse");
    } finally {
      setReplyLoading(false);
    }
  };

  const fetchReplies = async (parentId: string) => {
    setRepliesLoading(parentId);
    try {
      const token = localStorage.getItem('investeasy-token') || undefined;
      const data = await getReplies(parentId, {}, token);
      setReplies((prev) => ({ ...prev, [parentId]: data.replies || [] }));
    } catch {}
    setRepliesLoading(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Forum Communautaire</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Échangez avec d'autres investisseurs, partagez vos expériences et posez vos questions 
          à la communauté InvestEasy.
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* New Comment Form */}
        {isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                Partagez votre expérience
              </CardTitle>
              <CardDescription>
                Connecté en tant que {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Partagez votre expérience, posez une question ou donnez des conseils à la communauté..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {newComment.length}/500 caractères
                </span>
                <Button 
                  onClick={handleSubmitComment} 
                  disabled={loading || !newComment.trim()}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    "Publication..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publier
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Rejoignez la conversation</h3>
              <p className="text-muted-foreground mb-4">
                Connectez-vous pour participer aux discussions et partager vos expériences.
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <a href="/login">Se connecter</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/register">Créer un compte</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Discussions récentes</h2>
            <Badge variant="secondary">
              {pagination?.totalItems || 0} commentaire{(pagination?.totalItems || 0) > 1 ? 's' : ''}
            </Badge>
          </div>
          {fetching ? (
            <div className="flex justify-center items-center py-8"><Loader2 className="animate-spin h-6 w-6 text-primary" /></div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {getInitials(comment.user)}
                          </span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{comment.user.email}</span>
                              <Badge variant="outline" className="text-xs">
                                Membre
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(comment.createdAt)}
                              {user?.id === comment.userId && (
                                <>
                                  <Button variant="ghost" size="icon" className="text-xs" onClick={() => handleEdit(comment)} disabled={editLoading || deleteLoading === comment.id} title="Éditer">
                                    ✏️
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-xs" onClick={() => handleDelete(comment.id)} disabled={deleteLoading === comment.id} title="Supprimer">
                                    {deleteLoading === comment.id ? <Loader2 className="animate-spin h-4 w-4" /> : '🗑️'}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          {editingId === comment.id ? (
                            <div className="flex flex-col gap-2">
                              <Textarea value={editText} onChange={e => setEditText(e.target.value)} maxLength={500} />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleEditSubmit(comment.id)} disabled={editLoading}>{editLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Valider'}</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingId(null)} disabled={editLoading}>Annuler</Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground leading-relaxed">
                              {comment.text}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-muted-foreground hover:text-primary flex items-center gap-1 ${comment.isLiked ? 'text-primary' : ''}`}
                              disabled={likeLoading === comment.id || !isAuthenticated}
                              onClick={() => handleLike(comment.id)}
                            >
                              {likeLoading === comment.id ? <Loader2 className="animate-spin h-4 w-4" /> : '👍'} {comment.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-primary"
                              onClick={() => handleReply(comment.id)}
                              disabled={replyLoading || !isAuthenticated}
                            >
                              Répondre
                            </Button>
                          </div>
                          {/* Zone de réponse */}
                          {replyingId === comment.id && (
                            <div className="mt-2 flex flex-col gap-2">
                              <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} maxLength={500} placeholder="Votre réponse..." />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleReplySubmit(comment.id)} disabled={replyLoading}>{replyLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Répondre'}</Button>
                                <Button size="sm" variant="outline" onClick={() => setReplyingId(null)} disabled={replyLoading}>Annuler</Button>
                              </div>
                            </div>
                          )}
                          {/* Affichage des réponses */}
                          {repliesLoading === comment.id ? (
                            <div className="text-xs text-muted-foreground mt-2">Chargement des réponses...</div>
                          ) : replies[comment.id] && replies[comment.id].length > 0 && (
                            <div className="mt-4 pl-6 border-l">
                              {replies[comment.id].map((reply) => (
                                <div key={reply.id} className="mb-2">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="font-medium text-primary">{reply.user.email}</span>
                                    <span className="text-muted-foreground">{formatDate(reply.createdAt)}</span>
                                  </div>
                                  <div className="text-muted-foreground text-sm">{reply.text}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
          {/* Pagination */}
          {pagination && (
            <div className="flex justify-center items-center gap-4 mt-4">
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
        </div>
        {/* Community Guidelines */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Règles de la communauté</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Respectez les autres membres et leurs opinions</li>
              <li>• Partagez des informations fiables et vérifiées</li>
              <li>• Évitez le spam et les contenus promotionnels non sollicités</li>
              <li>• Les commentaires ne peuvent pas dépasser 500 caractères</li>
              <li>• Signalez tout contenu inapproprié aux modérateurs</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Forum; 