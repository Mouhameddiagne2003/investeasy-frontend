"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { User, UserRole } from "@/types/user";


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('investeasy-token');
    const userData = localStorage.getItem('investeasy-user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('investeasy-token');
        localStorage.removeItem('investeasy-user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error('Login failed');
      }
      const data = await res.json();
      console.log(data.user);
      // data doit contenir { user, token }
      localStorage.setItem('investeasy-token', data.token);
      localStorage.setItem('investeasy-user', JSON.stringify(data.user));
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: (data.user.role as string).toLowerCase() as UserRole,
        avatar: data.user.avatar,
      });
      toast.success("Vous êtes maintenant connecté à InvestEasy");
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Email ou mot de passe incorrect");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error('Registration failed');
      }
      const data = await res.json();
      // data doit contenir { user, token }
      localStorage.setItem('investeasy-token', data.token);
      localStorage.setItem('investeasy-user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Votre compte a été créé avec succès");
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Impossible de créer le compte");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('investeasy-token');
    localStorage.removeItem('investeasy-user');
    setUser(null);
    toast.success("Vous avez été déconnecté avec succès");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
