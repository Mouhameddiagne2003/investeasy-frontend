"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BookOpen, Users, Shield, ArrowRight, Play, MessageCircle, Target } from "lucide-react";

const Homepage = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Éducation Financière",
      description: "Apprenez les bases de l'investissement avec nos vidéos éducatives et guides pratiques.",
    },
    {
      icon: Target,
      title: "Recommandations Personnalisées",
      description: "Obtenez des conseils d'investissement adaptés à votre budget et vos objectifs.",
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Échangez avec d'autres investisseurs sénégalais sur notre forum communautaire.",
    },
    {
      icon: Shield,
      title: "Sécurisé et Fiable",
      description: "Plateforme sécurisée avec des informations vérifiées par des experts financiers.",
    },
  ];

  const stats = [
    { number: "1000+", label: "Utilisateurs actifs" },
    { number: "50+", label: "Vidéos éducatives" },
    { number: "500+", label: "Discussions forum" },
    { number: "95%", label: "Satisfaction utilisateur" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950/20 dark:via-background dark:to-green-950/20">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 py-24 pt-40 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mb-6 bg-background/60 backdrop-blur">
              <TrendingUp className="mr-2 h-4 w-4 text-primary" />
              Démocratiser l'investissement au Sénégal
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Investir intelligemment commence par apprendre
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              InvestEasy vous accompagne dans votre parcours d'investissement avec des outils éducatifs, 
              des recommandations personnalisées et une communauté bienveillante.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="group text-white">
                <Link href="/videos">
                  <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Commencer à apprendre
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/forum">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Rejoindre la communauté
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir InvestEasy ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète conçue spécialement pour les investisseurs sénégalais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 h-screen flex items-center justify-center overflow-hidden bg-background mb-24">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-card rounded-3xl shadow-2xl border border-white/20 mx-4 md:mx-24" />
        {/* Decorative SVGs */}
        <svg className="absolute left-0 top-0 w-48 h-48 opacity-20 -z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="100" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(100 100) scale(100)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7dd3fc" />
              <stop offset="1" stopColor="#6366f1" stopOpacity="0.3" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute right-0 bottom-0 w-64 h-64 opacity-20 -z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="100" fill="url(#paint1_radial)" />
          <defs>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(100 100) scale(100)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#6366f1" stopOpacity="0.2" />
            </radialGradient>
          </defs>
        </svg>
        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
            Prêt à commencer votre parcours d'investissement ?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto font-medium text-white/90 drop-shadow">
            Rejoignez des milliers de Sénégalais qui ont déjà commencé à investir intelligemment avec InvestEasy.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" variant="default" className="group relative px-8 py-4 text-md text-white font-semibold rounded-full shadow-xl transition-all duration-300 border-0">
              <Link href="/register" className="flex items-center">
                Créer un compte gratuit
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="relative px-8 py-4 text-md font-semibold rounded-full border-white/60 text-white hover:bg-white/10 hover:text-primary shadow-xl transition-all duration-300">
              <Link href="/videos">
                Explorer les ressources
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
