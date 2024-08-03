'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEvent, useState } from 'react';

export default function RegisterForm() {
    const [isAdmin, setIsAdmin] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log({formData});
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                admin: isAdmin,
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
                    <CardContent className="space-y-4 py-2">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Enter your full name" type='text' name='name' />
                            </div>
                            <div className="space-y-2 py-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="Enter your email address" type='email' name='email' />
                            </div>
                            <div className="space-y-2 py-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {/* <Link href="#" className="text-sm underline" prefetch={false}>
                                        Forgot password?
                                    </Link>*/}
                                </div>
                                <Input id="password" type="password" placeholder="Enter your password" name='password' />
                            </div>
                            <div className="space--2 flex items-center py-2">
                                <Checkbox
                                    id="admin"
                                    checked={isAdmin}
                                    onCheckedChange={(checked) => setIsAdmin(checked)}
                                />
                                <Label className='ml-2 align-middle' htmlFor="admin">Admin</Label>
                            </div>
                            <Button type="submit" className="w-full py-2">
                                Register
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                    </CardFooter>
                </CardHeader>
            </Card>
        </div>
    );
}
