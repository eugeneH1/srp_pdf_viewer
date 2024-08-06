'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "./store";
import type { RootState } from './store';

const AuthButton: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleAuth = useCallback(async () => {
    // console.log('handleAuth called', isLoggedIn);
    if (isLoggedIn) {
      try {
        const response = await fetch('/api/logout', { method: 'POST' });
        if (response.ok) {
          dispatch(logout());
          router.replace('/');
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    } else {
      router.replace('/login');
    }
  }, [isLoggedIn, dispatch, router]);

  const handleClick = () => {
    console.log('Button clicked');
    handleAuth();
  };

  return (
    <div className="flex items-center">
      <Button onClick={handleClick} className="px-auto m-2">
        {isLoggedIn ? 'Logout' : 'Login'}
      </Button>
      <div className="flex-grow flex justify-center">
        <Image src="/logo.png" alt="logo" width={100} height={100} />
      </div>
    </div>
  );
};

export default AuthButton;