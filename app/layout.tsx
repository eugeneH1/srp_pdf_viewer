import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthNav from './components/AuthNav' // New client component
import React from 'react'
import { AuthProvider } from './AuthContex'
import { cookies } from 'next/headers'

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
  // console.log("cookie type: ", typeof authCookie);

  // Log the session information
  console.log('Session:', { isLoggedIn, authCookie });
  return (
    <AuthProvider isLoggedIn={isLoggedIn} session={authCookie}>
      <html lang="en">
        <body className={inter.className}>
          <AuthNav />
          {children}
        </body>
      </html>
    </AuthProvider>
  )
}