// "use server"

import { z } from "zod"


export const signUpSchema = z.object({
    firstname: z.string().min(3),
    lastname: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(4),
});


export const signInSchema = z.object({
    firstname: z.string().min(3),
    lastname: z.string().min(3),
    password: z.string().min(4),
})

export const verifyOTP = z.object({
    username: z.string().min(3),
    otp: z.string().max(6),
})