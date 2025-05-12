'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthHydration, useAuthStore } from '@/stores/authStore';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthHydration();

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, hasHydrated, router]);

  return isAuthenticated ? children : null;
};