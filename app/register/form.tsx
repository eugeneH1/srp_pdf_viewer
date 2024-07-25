'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FormEvent } from 'react'

export default function RegisterForm() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log({formData});
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
            }),
        });
        console.log({response});
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to create your account.</CardDescription>
            </CardHeader>
            <CardHeader>
            <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="username">Name</Label>
                    <Input id="name" placeholder="Enter your full name" type='text' name='name'/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Enter your email address" type='email' name='email'/>
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
                    Register
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