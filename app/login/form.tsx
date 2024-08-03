'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setServerError('');
    const response = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (response?.error) {
      if (response.error.includes('No user found')) {
        setServerError('No user found with this email.');
      } else if (response.error.includes('Invalid password')) {
        setServerError('Incorrect password.');
      } else {
        setServerError('An unexpected error occurred.');
      }
    } else {
      router.push('/books');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
