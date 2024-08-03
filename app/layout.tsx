import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Logout from './logout'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Business Primer',
  description: '[beta] PDF Viewer for Silk Route Press',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();
  // console.log('Session: ', {session});
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          {!!session &&
          <span>
           <Logout /> 
          </span>
          }
          {!session &&
          <Link href="/login">
            <Button className='m-2 px-auto'>Login</Button>
          </Link>}
        </nav>
        {children}</body>
    </html>
  )
}
