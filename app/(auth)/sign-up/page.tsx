'use client';

import AuthForm from "@/components/AuthForm";
import { signUp } from "@/lib/actions/auth";
import { signUpSchema } from "@/lib/validations";



const page = () => (
    <AuthForm
    type="SIGN-UP"
    schema={signUpSchema}
    defaultValues={{
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    }}
    onSubmit={signUp}
    />
)

export default page;
