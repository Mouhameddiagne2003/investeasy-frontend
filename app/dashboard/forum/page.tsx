"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Send, Clock } from "lucide-react";

interface Comment {
  id: number;
  user_id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
}

const Forum = () => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: 1,
        user_id: "user1",
        author: "Amadou Diallo",
        text: "Excellente plateforme ! J'ai appris énormément grâce aux vidéos sur les investissements. Les recommandations sont très pertinentes pour le contexte sénégalais.",
        date: "2024-06-10T14:30:00Z",
        likes: 12
      },
      {
        id: 2,
        user_id: "user2",
        author: "Fatou Seck",
        text: "Je recommande vivement InvestEasy à tous ceux qui veulent commencer à investir. L'interface est intuitive et les conseils sont adaptés à notre marché local.",
        date: "2024-06-09T09:15:00Z",
        likes: 8
      },
      {
        id: 3,
        user_id: "user3",
        author: "Omar Ba",
        text: "Grâce aux recommandations, j'ai pu diversifier mon portefeuille. Maintenant je comprends mieux les risques et les opportunités du marché sénégalais.",
        date: "2024-06-08T16:45:00Z",
        likes: 15
      },
      {
        id: 4,
        user_id: "user4",
        author: "Aissatou Diop",
        text: "Les vidéos sur la planification de la retraite m'ont ouvert les yeux. Il n'est jamais trop tôt pour commencer à épargner pour l'avenir !",
        date: "2024-06-07T11:20:00Z",
        likes: 6
      },
      {
        id: 5,
        user_id: "user5",
        author: "Moussa Ndiaye",
        text: "Très bonne initiative ! Cette plateforme démocratise vraiment l'accès à l'information financière. Continuez comme ça !",
        date: "2024-06-06T13:55:00Z",
        likes: 10
      }
    ];
    setComments(mockComments);
  }, []);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Commentaire vide",
        description: "Veuillez écrire votre commentaire avant de l'envoyer",
        variant: "destructive",
      });
      return;
    }
    if (newComment.length > 500) {
      toast({
        title: "Commentaire trop long",
        description: "Le commentaire ne peut pas dépasser 500 caractères",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCommentObj: Comment = {
        id: comments.length + 1,
        user_id: user?.id || "current-user",
        author: user?.email || "Utilisateur",
        text: newComment,
        date: new Date().toISOString(),
        likes: 0
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      toast({
        title: "Commentaire publié",
        description: "Votre commentaire a été ajouté avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier le commentaire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
              {comments.length} commentaire{comments.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {getInitials(comment.author)}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{comment.author}</span>
                            <Badge variant="outline" className="text-xs">
                              Membre
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(comment.date)}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {comment.text}
                        </p>
                        <div className="flex items-center space-x-4 pt-2">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            👍 {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            Répondre
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
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