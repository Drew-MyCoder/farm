'use client';

import { ZodType } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { FIELD_NAMES, FIELD_TYPES } from '@/constants';
import { useState } from 'react';

// Updated interface to handle different response types
// interface AuthResponse {
//     success: boolean;
//     error?: string;
//     redirect?: string;
//     redirectUrl?: string;
//     message?: string;
// }

interface Props<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<AuthResponse>;
    type: 'SIGN-IN' | 'SIGN-UP' | 'OTP';
}

const AuthForm = <T extends FieldValues>({
    type,
    schema,
    defaultValues,
    onSubmit,
}: Props<T>) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const isSignIn = type === 'SIGN-IN';

    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        setIsLoading(true);
        try {
            const result = await onSubmit(data);
            
            if (result.success) {
                toast.success(isSignIn ? 'You have successfully signed in' : 'You have successfully signed up');
                
                // Handle different redirect scenarios
                if (result.redirect) {
                    router.push(result.redirect);
                } else if (result.redirectUrl) {
                    router.push(result.redirectUrl);
                } else {
                    // Default redirect for sign-up or OTP flow
                    router.push(type === 'SIGN-UP' ? '/sign-in' : '/otp');
                }
            } else {
                toast.error(result.error ?? result.message ?? `Error ${isSignIn ? 'signing in' : 'signing up'}`);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-semibold text-white'>
                {isSignIn ? 'Welcome to the Poultry Farm': 'Create your account'}
            </h1>

            <p className='text-white'>
                {isSignIn
                ? 'daily form logs'
                : 'complete fields to sign up'}
            </p>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='w-full space-y-6'
                    >
                        {Object.keys(defaultValues).map((fieldName) =>(
                            <FormField
                                key={fieldName}
                                control={form.control}
                                name={fieldName as Path<T>}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='capitalize'>
                                            {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES] || field.name}
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                required
                                                type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES] || 'text'}
                                                {...field}
                                                className='form-input' 
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                        ))}
                        <Button type='submit' disabled={isLoading} className='w-full'>
                            {isLoading ? 'Loading...' : (isSignIn ? 'Sign In' : 'Sign Up')}
                        </Button>
                    </form>
            </Form>

            <p className='text-center text-base font-medium'>
                {isSignIn ? 'New Worker? ' : 'Already have an account? '}

                <Link
                    href={isSignIn ? '/sign-up' : '/sign-in'}
                    className='font-bold text-primary'
                    >
                        {isSignIn ? 'Create an account' : 'Sign In'}
                    </Link>
            </p>
        </div>
    )
 };

 export default AuthForm