'use client';

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie } from 'cookies-next';
import axiosInstance from '@/axiosInstance';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import { AxiosError } from 'axios';

// Define the OTP data type
type OtpData = {
  user?: string;
  message?: string;
  email?: string;
};

// Define the API response type
type VerifyResponse = {
  roles: string;
  access_token: string;
  user: string;
  user_id: number;
  location_id: number | null;
  location_name: string | null;
};

// Cookie configuration
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/',
};

const USER_DATA_COOKIE_CONFIG = {
  httpOnly: false, // User data can be accessed by client
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/',
};

// Utility functions for auth data management
const storeAuthData = (authData: VerifyResponse) => {
  try {
    // Store JWT token in httpOnly cookie (most secure)
    setCookie('auth_token', authData.access_token, COOKIE_CONFIG);
    
    // Store non-sensitive user data in accessible cookie for UI
    const userData = {
      id: authData.user_id,
      name: authData.user,
      role: authData.roles,
      location_id: authData.location_id,
      location_name: authData.location_name,
    };
    
    setCookie('user_data', JSON.stringify(userData), USER_DATA_COOKIE_CONFIG);
    
    // console.log('Auth data stored successfully:', userData);
    return userData;
  } catch{
    // console.error('Error storing auth data:', error);
    return null;
  }
};

const clearAuthData = () => {
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
    
    console.log('Auth data cleared successfully');
    return true;
  } catch {
    // console.error('Error clearing auth data:', error);
    return false;
  }
};

const OTPForm = ({ serverOtpData }: { serverOtpData?: OtpData | null }) => {
  const router = useRouter();
  const { setUser } = useAuth();
  
  // State to store OTP data
  const [userData, setUserData] = useState<OtpData | null>(null);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    otp: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Initialize form with data from serverOtpData
  useEffect(() => {
    if (serverOtpData) {
      setUserData(serverOtpData);
      // console.log('Server OTP data received:', serverOtpData);
    }
    
    // Clear any existing auth data when starting OTP verification
    clearAuthData();
  }, [serverOtpData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'otp') {
      const otpValue = value.replace(/[^0-9]/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: otpValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // Validation
    if (!formData.firstname.trim()) {
      setStatus({ type: 'error', message: 'Firstname is required' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.lastname.trim()) {
      setStatus({ type: 'error', message: 'Lastname is required' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      setStatus({ type: 'error', message: 'Please enter a valid 6-digit OTP' });
      setIsSubmitting(false);
      return;
    }

    try {
      // console.log('Submitting OTP verification...');
      
      const response = await axiosInstance.post('/api/v1/verify', {
        username: formData.firstname + ' ' + formData.lastname,
        otp: formData.otp 
      });

      // console.log('OTP verification response:', response.data);

      if (!response || response.status !== 200) {
        throw new Error(response?.statusText || 'Verification failed');
      }

      // Extract data from response
      const responseData: VerifyResponse = response.data;
      
      const { 
        roles, 
        access_token, 
        user, 
        user_id, 
        location_id, 
        location_name 
      } = responseData;

      if (!access_token) {
        throw new Error("No access token received");
      }

      // console.log('Extracted response data:', {
      //   roles,
      //   user,
      //   user_id,
      //   location_id,
      //   location_name
      // });

      // Use the actual user name from response, fallback to form data if not provided
      const actualUserName = user || (formData.firstname + ' ' + formData.lastname);

      // Create the complete response object
      const completeAuthData: VerifyResponse = {
        roles,
        access_token,
        user: actualUserName,
        user_id,
        location_id,
        location_name
      };

      // Store authentication data securely in cookies
      const storedUserData = storeAuthData(completeAuthData);

      if (!storedUserData) {
        throw new Error("Failed to store authentication data");
      }

      // console.log('User data stored in cookies:', storedUserData);

      // Update auth context with complete user data
      setUser(storedUserData);

      setStatus({ type: 'success', message: 'OTP verified successfully!' });
      setFormData({ firstname: '', lastname: '', otp: '' });
      toast.success("Successfully verified");
      
      // Redirect based on user role
      setTimeout(() => {
        console.log('Redirecting user with role:', roles);
        if (roles === 'admin') {
          router.push("/admin");
        } else if (roles === "feeder" || roles === "manager") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 100);
    
    } catch (error: unknown) {
      // console.error('OTP verification error:', error);
      
      let errorMessage = 'Failed to verify OTP. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // If it's an axios error, get more details
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
          const data = axiosError.response.data as { message?: string };
          if (data.message) {
      errorMessage = data.message;
    }
        } else if (axiosError.response?.statusText) {
          errorMessage = axiosError.response.statusText;
        }
      }
      
      toast.error('Failed to verify OTP', {
        description: errorMessage,
      });
      
      setStatus({ 
        type: 'error', 
        message: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      setStatus({ type: 'error', message: 'Please enter both firstname and lastname to resend OTP' });
      return;
    }
    
    setIsResending(true);
    setStatus({ type: '', message: '' });
    
    try {
      console.log('Resending OTP...');
      
      const response = await axiosInstance.post('/verify', {
        username: formData.firstname + ' ' + formData.lastname
      });
      
      // console.log('Resend OTP response:', response.data);
      
      if (response.data?.message || response.data?.email) {
        const newUserData = {
          user: formData.firstname + ' ' + formData.lastname,
          message: response.data.message,
          email: response.data.email
        };
        
        setUserData(newUserData);
        // console.log('Updated user data after resend:', newUserData);
      }
      
      setStatus({ type: 'success', message: 'New OTP sent successfully!' });
      toast.success("New OTP sent successfully!");
    } catch (error: unknown) {
      // console.error('Resend OTP error:', error);
      
      let errorMessage = 'Failed to resend OTP. Please try again later.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
          const data = axiosError.response.data as { message?: string };
          if (data.message) {
      errorMessage = data.message;
    }
        } else if (axiosError.response?.statusText) {
          errorMessage = axiosError.response.statusText;
        }
      }
      
      setStatus({ type: 'error', message: errorMessage });
      toast.error("Failed to resend OTP", {
        description: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
  };

  // Show loading state while waiting for userData
  if (!userData && status.type !== 'warning') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle>Loading Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">OTP Verification</CardTitle>
          {userData?.message && <CardDescription>{userData.message}</CardDescription>}
          {userData?.email && <CardDescription>Code sent to: {userData.email}</CardDescription>}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {status.message && (
              <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                {status.type === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="firstname" className="text-sm font-medium">
                Firstname
              </label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter your firstname"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastname" className="text-sm font-medium">
                Lastname
              </label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Enter your lastname"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                OTP
              </label>
              <Input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <Button 
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendOTP}
              disabled={isResending || !formData.firstname.trim() || !formData.lastname.trim()}
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default OTPForm;