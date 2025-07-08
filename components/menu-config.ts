import { Users, Video, Settings, MessageCircle, LayoutDashboard, HomeIcon } from "lucide-react";

export const menuConfig = [
  {
    section: "Application",
    adminOnly: false,
    items: [
      {
        title: "Accueil",
        icon: HomeIcon,
        path: "/dashboard",
      },
      {
        title: "Vidéos",
        icon: Video,
        path: "/dashboard/videos",
      },
      {
        title: "Forum",
        icon: MessageCircle,
        path: "/dashboard/forum",
      },
      {
        title: "Recommandations",
        icon: Settings,
        path: "/dashboard/recommendations",
      },
    ],
  },
  {
    section: "Admin",
    adminOnly: true,
    items: [
      {
        title: "Tableau de bord",
        icon: LayoutDashboard,
        path: "/dashboard/admin",
      },
      {
        title: "Utilisateurs",
        icon: Users,
        path: "/dashboard/admin/user",
      },
      {
        title: "Vidéos",
        icon: Video,
        path: "/dashboard/admin/video",
      },
    ],
  },
];