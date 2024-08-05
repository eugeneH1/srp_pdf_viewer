'use client'
import { SessionProvider } from "next-auth/react";
import LoginForm from "./form";

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  );
}
