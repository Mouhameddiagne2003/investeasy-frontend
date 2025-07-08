import { Users, Video, Settings, MessageCircle, LayoutDashboard } from "lucide-react";

export const adminMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard/admin",
  },
  {
    title: "Utilisateurs",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Vidéos",
    icon: Video,
    path: "/admin/videos",
  },
  {
    title: "Paramètres",
    icon: Settings,
    path: "/admin/settings",
  },
];

export const appMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
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
];

export const menuSections = [
  {
    section: "Application",
    items: appMenuItems,
  },
  {
    section: "Admin",
    items: adminMenuItems,
    adminOnly: true,
  },
];

export const publicMenuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Vidéos", href: "/dashboard/videos" },
  { name: "Recommandations", href: "/dashboard/recommendations" },
  { name: "Forum", href: "/dashboard/forum" },
];