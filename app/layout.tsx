import { Providers } from './providers'
import { Metadata } from 'next'
import AuthNav from './components/AuthNav'
import './globals.css'
import ClientInitializer from './components/ClientInitializer'

export const metadata: Metadata = {
  title: 'Digital Business Primer',
  description: '[beta] PDF Viewer for Silk Route Press',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientInitializer />
          <AuthNav />
          {children}
        </Providers>
      </body>
    </html>
  )
}