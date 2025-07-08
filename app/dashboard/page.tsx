"use client"

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, MessageCircle, PlayCircle } from "lucide-react";

export default function Page() {
  const { user } = useAuth();
  const firstName = user?.email ? user.email.split("@")[0] : "Utilisateur";

  const quickLinks = [
    {
      href: "/dashboard/recommendations",
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Recommandations",
      desc: "Découvrez des idées d'investissement adaptées à votre profil.",
    },
    {
      href: "/dashboard/forum",
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Forum",
      desc: "Échangez avec la communauté et posez vos questions.",
    },
    {
      href: "/dashboard/videos",
      icon: <PlayCircle className="w-8 h-8 text-primary" />,
      title: "Vidéos",
      desc: "Apprenez grâce à nos vidéos pédagogiques.",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-3xl mx-auto w-full">
      {/* Message de bienvenue */}
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold">Bienvenue, {firstName} 👋</h1>
        <p className="text-muted-foreground text-lg">Ravi de vous revoir sur votre tableau de bord InvestEasy.</p>
      </div>

      {/* Liens rapides dynamiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <Card className="transition-transform duration-200 group-hover:scale-105 group-hover:shadow-lg cursor-pointer h-full">
              <CardHeader className="flex flex-col items-center gap-2 pb-2">
                {link.icon}
                <CardTitle className="text-lg text-center">{link.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Section Conseils/Actualités */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Conseil du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-base">
              <li>Investissez régulièrement, même de petits montants, pour profiter de l'effet cumulé.</li>
              <li>Diversifiez vos placements pour limiter les risques.</li>
              <li>Restez informé des tendances du marché et formez-vous en continu.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Citation inspirante */}
      <div className="mt-4">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
          <CardContent className="py-6 flex flex-col items-center">
            <blockquote className="italic text-lg text-center max-w-xl">
              "L'investissement dans la connaissance paie toujours les meilleurs intérêts."<br />
              <span className="block mt-2 text-sm text-muted-foreground">— Benjamin Franklin</span>
            </blockquote>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
