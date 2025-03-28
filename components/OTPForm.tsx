'use client';

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import axiosInstance from '@/axiosInstance';
import { toast } from 'sonner';






// Define the OTP data type
type OtpData = {
  user?: string;
  message?: string;
  email?: string;
};

// Accept serverOtpData as a prop
const OTPForm = ({ serverOtpData }: { serverOtpData?: OtpData | null }) => {
  const router = useRouter();
  
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

  // Initialize form with data from serverOtpData or localStorage
  useEffect(() => {
    // First check if server provided the data
    if (serverOtpData) {
      setUserData(serverOtpData);
    //   if (serverOtpData.user) {
    //     setFormData(prev => ({ ...prev, username: serverOtpData.user }));
    //   }
    } else {
      // As a fallback, try to get the data from localStorage
      try {
        const storedOtpData = localStorage.getItem('otpData');
        if (storedOtpData) {
          const parsedData = JSON.parse(storedOtpData);
          setUserData(parsedData);
          if (parsedData.user) {
            setFormData(prev => ({ ...prev, username: parsedData.user }));
          }
        }
      } catch (e) {
        console.error('Error parsing OTP data from localStorage:', e);
      }
    }
    
    // Store server data in localStorage for persistence
    if (serverOtpData) {
      localStorage.setItem('otpData', JSON.stringify(serverOtpData));
    }
    
    // Validate userData
    if (userData && (!userData.message || !userData.email)) {
      setStatus({ 
        type: 'warning', 
        message: 'Some verification data might be missing. Please ensure you received the correct OTP.' 
      });
    }
  }, [serverOtpData, userData]);

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
      setStatus({ type: 'error', message: 'firstname is required' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.lastname.trim()) {
      setStatus({ type: 'error', message: 'lastname is required' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      setStatus({ type: 'error', message: 'Please enter a valid 6-digit OTP' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        '/api/v1/verify',
        { username: formData.firstname+' '+formData.lastname,
          otp: formData.otp }
      )

      if (!response) {
        throw new Error('Verification failed');
      }

      if (response.status !== 200) {
        throw new Error(response.statusText || 'Verification failed');
      }

      const { roles, access_token, user, user_id } = response.data;

      if (!access_token) {
        throw new Error("No access token received");
      }

      setCookie("token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      // Store user information in localStorage
      if (user) {
        localStorage.setItem("userName", user || formData.firstname);
      }
      
      if (user_id) {
        localStorage.setItem("userId", user_id);
      }

      // Clear OTP data from localStorage as it's no longer needed
      localStorage.removeItem('otpData');

      setStatus({ type: 'success', message: 'OTP verified successfully!' });
      
      // Optional: Reset form after successful submission
      setFormData({ firstname: '', lastname: '', otp: '' });
      toast.success("Successfully verified");
      
      // Redirect based on user role
      setTimeout(() => {
        if (roles === 'admin') {
          router.push("/admin");
        } else if (roles === "feeder") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 1); // Brief delay to show success message 
    
    } catch (error: unknown) {
      const errorMessage = 'Failed to verify OTP. Please try again.';
      console.log(error);
      
      axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          let errorMessage = "An error occurred. Please try again."; // Default error message
      
          if (error.response) {
            // Server responded with a status code
            const status = error.response.status;
      
            if (status === 401) {
              errorMessage = "Invalid OTP or username. Please check and try again.";
            } else if (status === 404) {
              errorMessage = "User not found. Please check your username.";
            } else if (status === 410) {
              errorMessage = "OTP has expired. Please request a new one.";
            } else {
              errorMessage = error.response.data?.message || errorMessage;
            }
          } else if (error.request) {
            // Request was made but no response received
            errorMessage = "Server not responding. Please check your connection and try again.";
          }
      
          return Promise.reject(new Error(errorMessage)); // Ensure error is propagated
        }
      );
      toast.error('Failed to verify otp. Please try again.', {
        description: error instanceof Error ? error.message : "Failed to verify otp",
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
    if (!formData.firstname.trim()) {
      setStatus({ type: 'error', message: 'Please enter your firstname to resend OTP' });
      return;
    }

    if (!formData.lastname.trim()) {
      setStatus({ type: 'error', message: 'Please enter your lastname to resend OTP' });
      return;
    }
    
    setIsResending(true);
    setStatus({ type: '', message: '' });
    
    try {
      const response = await axiosInstance.post(
       '/verify',
        { username: formData.firstname+' '+formData.lastname },
      )
      
      
      // If the server returns new OTP data, update our state
      if (response.data?.message || response.data?.email) {
        setUserData({
          user: formData.firstname+' '+formData.lastname,
          message: response.data.message,
          email: response.data.email
        });
        
        // Store updated data in localStorage
        localStorage.setItem('otpData', JSON.stringify({
          user: formData.firstname+' '+formData.lastname,
          message: response.data.message,
          email: response.data.email
        }));
      }
      
      setStatus({ type: 'success', message: 'New OTP sent successfully!' });
    } catch (error: unknown) {
      console.log(error);
      const errorMessage = 'Failed to resend OTP. Please try again later.';
      
      axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          let errorMessage = "An error occurred. Please try again."; // Default error message
      
          if (error.response) {
            const status = error.response.status;
      
            if (status === 401) {
              errorMessage = "Invalid OTP or username. Please check and try again.";
            } else if (status === 404) {
              errorMessage = "User not found. Please check your username.";
            } else if (status === 410) {
              errorMessage = "OTP has expired. Please request a new one.";
            }
          } else if (error.request) {
            errorMessage = "Server not responding. Please check your connection and try again.";
          }
      
          return Promise.reject(new Error(errorMessage));
        }
      );
      
      
      setStatus({ type: 'error', message: errorMessage });
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
              <Alert variant={status.type === 'error' ? 'destructive' : status.type === 'warning' ? 'default' : 'default'}>
                {status.type === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : status.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
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
                className="w-full"
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
                className="w-full"
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
                inputMode='numeric'
                autoComplete='one-time-code'
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                className="w-full mb-4"
                maxLength={6}
              />
              {/* <p className="text-xs text-gray-500 text-center mt-1">
                Enter the 6-digit code sent to your email
              </p> */}
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