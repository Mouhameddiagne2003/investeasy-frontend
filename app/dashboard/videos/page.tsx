"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Eye } from "lucide-react";

const Videos = () => {
  const videos = [
    {
      id: 1,
      title: "Introduction à l'investissement",
      description: "Découvrez les concepts de base de l'investissement et pourquoi il est important de commencer tôt.",
      duration: "15:30",
      views: "2.3k",
      category: "Débutant",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      embedId: "dQw4w9WgXcQ",
      level: "Débutant"
    },
    {
      id: 2,
      title: "Les types de placements au Sénégal",
      description: "Explorez les différentes options d'investissement disponibles pour les investisseurs sénégalais.",
      duration: "22:45",
      views: "1.8k",
      category: "Intermédiaire",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      embedId: "dQw4w9WgXcQ",
      level: "Intermédiaire"
    },
    {
      id: 3,
      title: "Gestion des risques financiers",
      description: "Apprenez à évaluer et gérer les risques dans vos investissements pour protéger votre capital.",
      duration: "18:20",
      views: "1.5k",
      category: "Intermédiaire",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      embedId: "dQw4w9WgXcQ",
      level: "Intermédiaire"
    },
    {
      id: 4,
      title: "Planification de la retraite",
      description: "Stratégies pour préparer votre retraite grâce à des investissements à long terme.",
      duration: "25:10",
      views: "2.1k",
      category: "Avancé",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      embedId: "dQw4w9WgXcQ",
      level: "Avancé"
    },
    {
      id: 5,
      title: "Investir dans l'immobilier sénégalais",
      description: "Guide complet pour investir dans l'immobilier au Sénégal : opportunités et défis.",
      duration: "28:45",
      views: "3.2k",
      category: "Avancé",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      embedId: "dQw4w9WgXcQ",
      level: "Avancé"
    }
  ];

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
      {/* Videos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {videos.map((video) => (
          <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="absolute top-4 left-4">
                <Badge className={getLevelColor(video.level)}>
                  {video.level}
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
                    {video.duration}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {video.views} vues
                  </div>
                </div>
                <div className="flex items-center text-primary">
                  <Play className="h-4 w-4 mr-1" />
                  Regarder
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Vous voulez plus de contenu ?</h3>
            <p className="text-muted-foreground mb-6">
              Inscrivez-vous pour accéder à notre bibliothèque complète de ressources éducatives 
              et recevoir des recommandations personnalisées.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md transition-colors">
                Créer un compte gratuit
              </button>
              <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 rounded-md transition-colors">
                Explorer les recommandations
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Videos; 