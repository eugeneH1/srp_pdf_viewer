'use client';

import React from 'react';
import Home from './components/Home';
import ClientLayout from './ClientLayout';

export default function Page() {
  return (
    <ClientLayout>
      <Home />
    </ClientLayout>
  );
}