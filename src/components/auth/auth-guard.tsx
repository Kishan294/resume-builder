'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = false,
  redirectTo = '/auth/login'
}: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (requireAuth && !session) {
        router.push(redirectTo);
      } else if (!requireAuth && session) {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, requireAuth, redirectTo, router]);

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For auth pages, don't render if user is logged in
  if (!requireAuth && session) {
    return null;
  }

  // For protected pages, don't render if user is not logged in
  if (requireAuth && !session) {
    return null;
  }

  return <>{children}</>;
}