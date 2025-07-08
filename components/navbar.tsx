"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 rounded-xl border bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-primary">
            <TrendingUp className="h-6 w-6" />
            <span>InvestEasy</span>
          </Link>

          {/* Auth Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild className="text-white">
              <Link href="/register">Inscription</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
