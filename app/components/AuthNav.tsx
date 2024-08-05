'use client'; // This is a client component
import { useEffect, useState } from 'react';
import AuthButton from '../authButton';

interface AuthNavProps {
  isLoggedIn: boolean;
}

const AuthNav: React.FC<AuthNavProps> = ({ isLoggedIn}) => {
  return (
    <nav>
      <AuthButton isLoggedIn={isLoggedIn} />
    </nav>
  );
};

export default AuthNav;