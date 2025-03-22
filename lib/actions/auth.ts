'use server';


import axios from 'axios';
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';


export const signInWithCredentials = async (params: Pick<AuthCredentials,
    'username' | 'password'>) => {

        const { username, password } = params;

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/login",
                { username, password },
                { headers: { "Content-Type": "application/json"}},
                
            );
            
            if (!response) {
                return { message: 'sorry unable to connect' }
            }

            if (response?.status != 200) {
                return { success: false, error: response.statusText}

            }
            const cookiesStore = await cookies();
            // Check if OTP is required (API sends OTP data)
                if (response.data?.message?.includes('verification') || 
                response.data?.message?.includes('OTP')) {
            
            // Store OTP data in cookies to be read by the OTP page
            
             cookiesStore.set('otpData', JSON.stringify({
                user: response.data.user,
                message: response.data.message,
                email: response.data.email
            }), { maxAge: 600 }); // 10 minutes expiry
            
            // Redirect to OTP page
            console.log("redirecting to otp...");
            return { success: true, redirect: '/otp'};
            }

            // If there's no OTP required, handle normal login success
    // Store token in cookies

    if (response.data?.access_token) {
         cookiesStore.set('token', response.data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/',
        });
        
        // Redirect based on user role
        // if (response.data.roles === 'admin') {
        //   return redirect('/admin');
        // } else if (response.data.roles === 'feeder') {
        //   return redirect('/dashboard');
        // } else {
        //   return redirect('/');
        // }

        return { success: true, 
            redirectUrl: response.data.roles === 'admin' ? '/admin' : '/dashboard' };
      }
  
      return response.data

            
        } catch (error: any) {
            console.error('Login failed', error)
            // throw error;
            return { 
                error: error.response?.data?.message || 'Login failed. Please try again.' 
              };
        };
}


export const signUp = async (params: AuthCredentials) => {
    const { username, email, password } = params;

    try {
        const response = await axios.post(
            "http://localhost:8000/api/v1/auth/register",
            { email, username, password, status: 'active', role: 'feeder' },
            { headers: { "Content-Type": "application/json"}},
            
        );
        // console.log(username, password);
        if (!response) {
            return { message: 'sorry unable to connect' }
        }

        if (response?.status != 200) {
            return { success: false, error: response.statusText}
        }

        console.log(response)

        const { access_token } = response.data;

        redirect('/sign-in');
        // console.log(access_token);

        // store token
        // localStorage.setItem("token", access_token);

        return response.data; 
        
    } catch (error) {
        console.error('Login failed', error)
        throw error;
    };
}



export const getBuyers = async () => {
    try {
        const response = await axios.get(
            "http://localhost:8000/buyers",
            { headers: { "Content-Type": "application/json"}},         
        );
        if (!response){
            return {message: "Sorry, unable to fetch buyers"};
        }
        if (response?.status != 200) {
            return { success: false, error: response.statusText}
        }
        return response.data
        // console.log(response)

    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
      }
}


export const getCoops = async () => {
    try {
        const response = await axios.get(
            "http://localhost:8000/coops",
            { headers: { "Content-Type": "application/json"}},         
        );
        if (!response){
            return {message: "Sorry, unable to fetch coops"};
        }
        if (response?.status != 200) {
            return { success: false, error: response.statusText}
        }

        // const data =  response.data;

        // // ensure uniqueness based on coop name
        // const uniqueCoops = Array.isArray(data)
        // ? [ ...new Map(data.map(coop => [coop.coop_name, coop])).values()]
        // : [];

        // return uniqueCoops;

        return response.data;
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
      }
}

