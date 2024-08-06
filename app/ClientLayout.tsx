'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuthFromCookie } from './utils/auth';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    initializeAuthFromCookie(dispatch);
  }, [dispatch]);

  return <>{children}</>;
}