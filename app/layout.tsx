import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthNav from './components/AuthNav' // New client component
import { cookies } from 'next/headers'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Business Primer',
  description: '[beta] PDF Viewer for Silk Route Press',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authCookie = cookies().get('auth_token');
  const isLoggedIn = !!authCookie; // Determine logged-in status based on cookie

  // Log the session information
  console.log('Session:', { isLoggedIn, authCookie });

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthNav isLoggedIn={isLoggedIn} /> {/* Pass logged-in status to client component */}
        {React.cloneElement(children as React.ReactElement, { isLoggedIn })} {/* Pass isLoggedIn to children */}
      </body>
    </html>
  )
}