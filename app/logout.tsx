'use client'
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

import React from 'react';

const Logout: React.FC = () => {
  const handleLogout = () => {
    // Add your logout logic here
    signOut();
    console.log('User logged out');
  };

  return (
    <Button onClick={handleLogout} className="px-auto m-10">
      Logout
    </Button>
  );
};

export default Logout;