'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import Cookies from 'js-cookie';
import { useState } from 'react';

interface AuthButtonProps {
  isLoggedIn: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isLoggedIn }) => {
  const router = useRouter();
  const [LoggedIn, setIsLoggedIn] = useState(isLoggedIn);

  const handleAuth = async () => {
    if (isLoggedIn) {
      // Handle logout
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        Cookies.remove('auth_token');
        setIsLoggedIn(false);
        router.replace('/');
      } else {
        console.error('Failed to log out');
      }
    } else {
      router.replace('/login');
    }
  };

  return (
    <div className="flex items-center">
      <Button onClick={handleAuth} className="px-auto m-2">
        {LoggedIn ? 'Logout' : 'Login'}
      </Button>
      <div className="flex-grow flex justify-center">
        <Image src="/logo.png" alt="logo" width={100} height={100} />
      </div>
    </div>
  );
};

export default AuthButton;