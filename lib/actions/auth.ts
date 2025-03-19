'use server';


import axios from 'axios';
import { redirect } from "next/navigation";
import { setCookie } from 'cookies-next';


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
            const { access_token } = response.data;

            setCookie("token", access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, //1 day
                path: '/',
            });
            console.log('api response data ', response.data)
            // console.log('token stored in cookies: ', access_token)
            // redirect(`/otp?user=${encodeURIComponent(response.data.user)}&message=${encodeURIComponent(response.data.message)}&email=${encodeURIComponent(response.data.email)}`)
            redirect('/otp');

            return response.data; 
            
        } catch (error) {
            console.error('Login failed', error)
            throw error;
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
        return response.data
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
      }
}

