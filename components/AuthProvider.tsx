// AuthProvider.tsx - Updated to work with cookies and properly handle location data
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, deleteCookie } from 'cookies-next';

type User = {
  id: number;
  name: string;
  role: string;
  location_id: number | null;
  location_name: string | null;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to get user data from cookies
const getUserDataFromCookies = (): User => {
  try {
    const userDataCookie = getCookie('user_data');
    if (userDataCookie) {
      const userData = JSON.parse(userDataCookie as string);
      // console.log('User data loaded from cookies:', userData);
      return userData;
    }
    return null;
  } catch (error) {
    // console.error('Error parsing user data from cookies:', error);
    return null;
  }
};

// Utility function to clear all auth data
const clearAllAuthData = () => {
  try {
    deleteCookie('auth_token', { path: '/' });
    deleteCookie('user_data', { path: '/' });
    
    // Clear any remaining localStorage data for cleanup
    if (typeof window !== 'undefined') {
      localStorage.removeItem('otpData');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('locationId');
      localStorage.removeItem('locationName');
      localStorage.removeItem('userRole');
    }
    
    // console.log('All auth data cleared successfully');
    return true;
  } catch (error) {
    // console.error('Error clearing auth data:', error);
    return false;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize user data from cookies on app load
    console.log('AuthProvider: Initializing user data from cookies...');
    
    const userData = getUserDataFromCookies();
    if (userData) {
      // console.log('AuthProvider: User data found:', userData);
      setUser(userData);
    } else {
      console.log('AuthProvider: No user data found in cookies');
    }
    
    setIsLoading(false);
  }, []);

  // Custom setUser function that also updates cookies
  const updateUser = (newUser: User) => {
    // console.log('AuthProvider: Updating user data:', newUser);
    setUser(newUser);
    
    // If user is being set to null, clear cookies
    if (!newUser) {
      clearAllAuthData();
    }
  };

  const logout = () => {
    // console.log('AuthProvider: Logging out user');
    clearAllAuthData();
    setUser(null);
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // Debug logging
  // useEffect(() => {
  //   console.log('AuthProvider: User state changed:', {
  //     user,
  //     isLoading,
  //     hasLocationId: user?.location_id !== null,
  //     hasLocationName: user?.location_name !== null
  //   });
  // }, [user, isLoading]);

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};