'use client';

import AuthForm from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";
import { signInSchema } from "@/lib/validations";



const page = () => (
    <AuthForm
    type="SIGN-IN"
    schema={signInSchema}
    defaultValues={{
        firstname: "",
        lastname: "",
        password: "",
    }}
    onSubmit={signInWithCredentials}
    />
)

export default page;
