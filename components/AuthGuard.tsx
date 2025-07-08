"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;
    // Si la page doit être accessible uniquement si déconnecté (ex: login/register/landing)
    if (blockIfAuthenticated && isAuthenticated) {
      toast({
        title: "Déjà connecté",
        description: "Vous êtes déjà connecté(e)",
        variant: "destructive",
      });
      router.replace("/dashboard");
      return;
    }
    // Si la page doit être accessible uniquement si connecté
    if (requireAuth && !isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté(e) pour accéder à cette page",
        variant: "destructive",
      });
      router.replace("/login");
      return;
    }
    // Si la page doit être accessible uniquement si admin
    if (requireAdmin && user?.role !== UserRole.ADMIN) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits pour accéder à cette page",
        variant: "destructive",
      });
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