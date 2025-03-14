'use client';

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';


const OTPForm = ({ userData }: 
  { userData?: { 
    user?: string; 
    message?: string; 
    email?: string 
  } }) => {
  
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    otp: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const params = useParams();


console.log('this is the userdata', params?.userData);

  // Initialize form with data from params or userData
  useEffect(() => {
    if (params?.username) {
      setFormData(prev => ({ ...prev, username: params.username as string }));
    } 

    // Validate userData
    if (!userData?.message || !userData?.email) {
      setStatus({ 
        type: 'warning', 
        message: 'Some verification data might be missing. Please ensure you received the correct OTP.' 
      });
    }
  }, [userData, params]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'otp') {
      const otpValue = value.replace(/[^0-9]/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: otpValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // Validation
    if (!formData.username.trim()) {
      setStatus({ type: 'error', message: 'Username is required' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      setStatus({ type: 'error', message: 'Please enter a valid 6-digit OTP' });
      setIsSubmitting(false);
      return;
    }

    try {
        const response = await axios.post(
            "http://localhost:8000/api/v1/verify",
            { username: formData.username, otp: formData.otp },
            { headers: { "Content-Type": "application/json"}},
            
        );
        console.log('full api response', response);
        console.log('name from api ', response.data.user)
        const data = await response
        if (!response) {
          throw new Error(data.statusText || 'Verification failed');
        }

        if (response.status !== 200) {
          throw new Error (response.statusText || 'Verification failed')
        }

        const { roles , access_token, user, user_id } = await response.data;

        if (!access_token) {
          throw new Error("No access token received")
        }

        setCookie("token", access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, //1 day
          path: '/',
      });

      // Store user information in localStorage
      if (user) {
        localStorage.setItem("userName", user || formData.username);
        console.log('stored name in local storage ', user || formData.username)
      }
      
      if (user_id) {
        localStorage.setItem("userId", user_id);
      }

      console.log('token stored in cookies: ', access_token)

      

      setStatus({ type: 'success', message: 'OTP verified successfully!' });
      
      // Optional: Reset form after successful submission
      setFormData({ username: '', otp: '' });
      
    // Redirect based on user role
    setTimeout(() => {
      if (roles === 'admin') {
        router.push("/admin");
      } else if (roles === "feeder") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }, 1000); // Brief delay to show success message 
    
    } catch (error: any) {
      let errorMessage = 'Failed to verify OTP. Please try again.';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with an error
          const status = error.response.status;
          if (status === 401) {
            errorMessage = 'Invalid OTP or username. Please check and try again.';
          } else if (status === 404) {
            errorMessage = 'User not found. Please check your username.';
          } else if (status === 410) {
            errorMessage = 'OTP has expired. Please request a new one.';
          } else {
            errorMessage = error.response.data?.message || errorMessage;
          }
        } else if (error.request) {
          // No response received
          errorMessage = 'Server not responding. Please check your connection and try again.';
        }
      }
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to verify OTP. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.username.trim()) {
      setStatus({ type: 'error', message: 'Please enter your username to resend OTP' });
      return;
    }
    
    setIsResending(true);
    setStatus({ type: '', message: '' });
    
    try {
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = "http://localhost:8000/api/v1"
      const response = await axios.post(
        `${apiUrl}/verify`,
        { username: formData.username },
        { headers: { "Content-Type": "application/json" }}
      );
      
      setStatus({ type: 'success', message: 'New OTP sent successfully!' });
    } catch (error: any) {
      let errorMessage = 'Failed to resend OTP. Please try again later.';
      
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
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
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
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
                className="w-full"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center mt-1">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          </CardContent>

          <CardFooter>
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
              disabled={isResending || !formData.username.trim()}
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

