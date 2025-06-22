import axiosInstance from '@/axiosInstance';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const getAuthState = async (): Promise<AuthState> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? null;
  const refreshToken = cookieStore.get('refresh_token')?.value ?? null;


  if (!token && !refreshToken) {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }

  try {
    // If no access token but refresh token exists, try to refresh
    if (!token && refreshToken) {
      const refreshResponse = await axiosInstance.get('/api/v1/refresh');
      
      if (refreshResponse.status === 200) {
        const { access_token, user, roles } = refreshResponse.data;
        
        // Set new access token
        cookieStore.set('token', access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/',
        });

        return {
          isAuthenticated: true,
          user: {
            id: '', // You might want to get this from your user endpoint
            username: user,
            email: '', // You might want to get this from your user endpoint
            role: roles,
          },
          token: access_token,
        };
      }
    }

    // Verify current token by making a request to a protected endpoint
    const response = await axiosInstance.get('/api/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return {
        isAuthenticated: true,
        user: response.data,
        token,
      };
    }
  } catch (error) {
    console.error('Auth verification failed:', error);
    // Clear invalid cookies
    cookieStore.delete('token');
    cookieStore.delete('refresh_token');
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
};

export const requireAuth = async () => {
  const authState = await getAuthState();
  
  if (!authState.isAuthenticated) {
    redirect('/sign-in');
  }
  
  return authState;
};