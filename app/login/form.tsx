'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FormEvent } from 'react'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const router = useRouter();
   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        }); 
    if(!response?.error){
        router.push('/reader');
        router.refresh();
    }
    } 

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to sign in your account.</CardDescription>
            </CardHeader>
            <CardHeader>
            <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Name</Label>
                    <Input id="email" placeholder="Enter your email address" type='text' name='email'/>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {/* <Link href="#" className="text-sm underline" prefetch={false}>
                        Forgot password?
                    </Link>*/}
                    </div> 
                    <Input id="password" type="password" placeholder="Enter your password" name='password' />
                </div>
                <Button type="submit" className="w-full">
                    Sign in
                </Button>
            </form>
            </CardContent>
            <CardFooter>
            </CardFooter>
            </CardHeader>
        </Card>
        </div>
    )
}