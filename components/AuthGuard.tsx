"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = doit être connecté, false = doit être déconnecté, undefined = indifférent
  requireAdmin?: boolean;
  blockIfAuthenticated?: boolean; // pour les pages d'auth/landing
}

export default function AuthGuard({
  children,
  requireAuth,
  requireAdmin,
  blockIfAuthenticated,
}: AuthGuardProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname === "/";

  useEffect(() => {
    if (loading) return;
    // 1. Si la page doit être accessible uniquement si déconnecté (ex: login/register/landing)
    if (blockIfAuthenticated && isAuthenticated && isPublicPage) {
      toast.error("Vous êtes déjà connecté(e)");
      router.replace("/dashboard");
      return;
    }
    // 2. Si la page doit être accessible uniquement si connecté
    if (requireAuth && !isAuthenticated) {
      toast.error("Vous devez être connecté(e) pour accéder à cette page");
      router.replace("/login");
      return;
    }
    // 3. Si la page doit être accessible uniquement si admin
    if (requireAdmin && user?.role !== UserRole.ADMIN) {
      toast.error("Vous n'avez pas les droits pour accéder à cette page");
      router.replace("/dashboard");
      return;
    }
  }, [isAuthenticated, loading, user, requireAuth, requireAdmin, blockIfAuthenticated, router, pathname, toast]);

  // Optionnel : afficher un loader si loading
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return <>{children}</>;
} 