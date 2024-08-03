'use client'
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from 'next/image';

import React from 'react';

const Logout: React.FC = () => {
  const handleLogout = () => {
    // Add your logout logic here
    signOut();
    // console.log('User logged out');
  };

  return (
      <div className="flex items-center">
        <Button onClick={handleLogout} className="px-auto m-2">
          Logout
        </Button>
        <div className="flex-grow flex justify-center">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>
        </div>
  );
};

export default Logout;