'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import Image from 'next/image';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setServerError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        setServerError(errorData.message);
        toast.error(errorData.message);
      } else {
        const successData = await response.json();
        toast.success(successData.message);
        router.replace('/books');
      }
    } catch (error) {
      setIsLoading(false);
      setServerError('An unexpected error occurred.');
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background sm:flex-row">
      <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md p-8 bg-white bg-opacity-90 sm:bg-opacity-100">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 shadow-lg rounded-lg w-full">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p>Enter your credentials to sign in your account.</p>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email address" {...field} />
                  </FormControl>
                  {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                </FormItem>
              )}
            />
            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
            <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>
      </div>
      <div className="relative w-full hidden sm:block sm:w-1/2">
        <Image
          src="/pixels.png"
          alt="Logo"
          layout="fill"
          objectFit="cover"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 w-full h-full sm:hidden bg-cover bg-center" style={{ backgroundImage: "url('/pixels.png')" }}></div>
    </div>
  );
}
