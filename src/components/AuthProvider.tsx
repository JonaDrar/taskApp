'use client';

import { useEffect } from 'react';
import useAuthStore from '@/context/authStore';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const router = useRouter();
  const pathname = usePathname(); // Obteniendo la ruta actual

  useEffect(() => {
    initializeAuth(); // Verifica la autenticación al cargar la app
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/login') {
        router.push('/login'); // Redirige al login si no está autenticado
      } else if (user && pathname === '/login') {
        router.push('/'); // Redirige a la página principal si está autenticado
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >Loading...</div>;
  }

  return <>{children}</>;
}