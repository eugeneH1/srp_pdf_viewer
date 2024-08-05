// 'use client';

import React from 'react';
import Home from './components/Home'; // Adjust the import as necessary
import { cookies } from 'next/headers';

export default function Page() {
  const authCookie = cookies().get('auth_token');
  const isLoggedIn = !!authCookie; // Determine logged-in status based on cookie

  return <Home isLoggedIn={isLoggedIn} />;
}