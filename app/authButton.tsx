'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { useAuth } from "./AuthContex";

interface AuthButtonProps {
  isLoggedIn: boolean; // Define the prop type
}

const AuthButton: React.FC<AuthButtonProps> = ({ isLoggedIn }) => {
  const router = useRouter();
  const { login, logout } = useAuth(); // Access the authentication state and functions

  const handleAuth = async () => {
    if (isLoggedIn) {
      await logout(); // Call the logout function
      router.replace('/'); // Redirect to home
    } else {
      router.replace('/login'); // Redirect to login page
    }
  };

  return (
    <div className="flex items-center">
      <Button onClick={handleAuth} className="px-auto m-2">
        {isLoggedIn ? 'Logout' : 'Login'} {/* Change text based on state */}
      </Button>
      <div className="flex-grow flex justify-center">
        <Image src="/logo.png" alt="logo" width={100} height={100} />
      </div>
    </div>
  );
};

export default AuthButton;