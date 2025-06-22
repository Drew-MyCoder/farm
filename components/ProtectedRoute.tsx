'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = <div className="flex items-center justify-center min-h-screen">Loading...</div>,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // console.log('ProtectedRoute Debug:', { 
    //   // loading, 
    //   user: user ? { 
    //     id: user.id,
    //     name: user.name,
    //     role: user.role,
    //     location_id: user.location_id,
    //     location_name: user.location_name
    //   } : null, 
    //   requiredRole,
    //   pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    // });

    // Don't do anything while auth is still loading
    // if (loading) return;

    // If no user is authenticated, redirect to sign-in
    if (!user) {
      // console.log('No user found, redirecting to sign-in');
      setIsRedirecting(true);
      router.push('/sign-in');
      return;
    }

    // If user is authenticated but doesn't have required role
    if (requiredRole && user.role !== requiredRole) {
      // console.log(`User role ${user.role} doesn't match required role ${requiredRole}`);
      setIsRedirecting(true);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard'); // Regular users go to dashboard
      }
      return;
    }

    // Reset redirecting state if we reach here
    setIsRedirecting(false);
    // console.log('User authenticated and authorized');
  }, [user, requiredRole, router]);

  // Show loading while auth is loading or while redirecting
  if ( isRedirecting) {
    return <>{fallback}</>;
  }

  // If no user after loading, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  // If user doesn't have required role, don't render anything (redirect will happen)
  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  // User is authenticated and has correct role (or no role required)
  return <>{children}</>;
};