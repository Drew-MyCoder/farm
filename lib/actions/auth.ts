'use server';

import { redirect } from "next/navigation";
import { cookies } from 'next/headers';
import axiosInstance from '@/axiosInstance';
import { AxiosError } from "axios";


export const signInWithCredentials = async (params: Pick<AuthCredentials,
    'firstname' | 'lastname' | 'password'>): Promise<AuthResponse> => {

        const { firstname, lastname, password } = params;

        try {
            const response = await axiosInstance.post(
                '/api/v1/login',
                { username: firstname + ' ' + lastname, password }
            );
            
            if (!response) {
                return { success: false, error: 'Sorry, unable to connect' };
            }

            if (response?.status !== 200) {
                return { success: false, error: response.statusText };
            }

            const cookiesStore = await cookies();
            
            // Check if OTP is required
            if (response.data?.message?.includes('verification') || 
                response.data?.message?.includes('OTP')) {
            
                // Store OTP data in cookies
                cookiesStore.set('otpData', JSON.stringify({
                    user: response.data.user,
                    message: response.data.message,
                    email: response.data.email
                }), { 
                    maxAge: 600, // 10 minutes expiry
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });
            
                console.log("OTP required, redirecting to OTP page...");
                return { success: true, redirect: '/otp' };
            }

            // Handle normal login success
            if (response.data?.access_token) {
                cookiesStore.set('token', response.data.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                    sameSite: 'lax',
                });

                const redirectUrl = response.data.roles === 'admin' ? '/admin' : '/dashboard';
                return { success: true, redirectUrl };
            }

            return { success: true, message: 'Login successful' };
            
        } catch (error) {
            const axiosError = error as AxiosError;

            console.error('Login failed', axiosError);

            // const errorMessage =
            //     axiosError.response?.data || 'Login failed. Please try again.';

            return {
                success: false,
                error: 'something went wrong',
            };
            }
};


export const signUp = async (params: AuthCredentials): Promise<AuthResponse> => {
    const { firstname, lastname, email, password } = params;

    try {
        const response = await axiosInstance.post('/api/v1/auth/register', {
            email, 
            username: firstname + ' ' + lastname, 
            password, 
            status: 'active', 
            role: 'feeder'
        });

        if (!response) {
            return { success: false, error: 'Sorry, unable to connect' };
        }

        if (response?.status !== 200) {
            return { success: false, error: response.statusText };
        }

        if (response.status === 200) {
            return { 
                success: true, 
                redirect: '/sign-in',
                message: 'Account created successfully! Please sign in.'
            };
        }

        return { success: false, error: 'Registration failed' };
        
    } catch (error) {
        const axiosError = error as AxiosError;

        console.error('registration failed', axiosError);

        // const errorMessage =
        //     axiosError.response?.data || 'registration failed. Please try again.';

        return {
            success: false,
            error: 'registration failed, pls try again',
        };
        }
};

export const logout = async (): Promise<void> => {
    try {
        await axiosInstance.post('/api/v1/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        const cookiesStore = await cookies();
        cookiesStore.delete('token');
        cookiesStore.delete('refresh_token');
        redirect('/sign-in');
    }
};

// Helper function for consistent API response handling
export const getBuyers = async () => {
    try {
        const response = await axiosInstance.get('/buyers');
        
        if (!response) {
            return { success: false, error: "Sorry, unable to fetch buyers" };
        }
        
        if (response?.status !== 200) {
            return { success: false, error: response.statusText };
        }
        
        return { success: true, data: response.data };
        
    } catch (error) {
        const axiosError = error as AxiosError;

        console.error('failed to fetch buyers', axiosError);

        const errorMessage =
            axiosError.response?.data || 'axios error for fetching buyers';

        return {
            success: false,
            error: errorMessage,
        };
}
};

export const getCoops = async () => {
    try {
        const response = await axiosInstance.get('/coops/');
        
        if (!response) {
            return { success: false, error: "Sorry, unable to fetch coops" };
        }
        
        if (response?.status !== 200) {
            return { success: false, error: response.statusText };
        }

        return { success: true, data: response.data };
        
    } catch (error) {
        console.error('Failed to fetch coops:', error);
        return { 
            success: false, 
            error: error || 'Failed to fetch coops'
        };
    }
};

