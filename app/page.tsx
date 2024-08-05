import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-background"
      style={{
        backgroundImage: "url('/bg1.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="flex flex-col items-center space-y-6 bg-background/80 p-8 rounded-lg">
        <Image className="h-auto w-auto" src="/logo_nobg.png" alt="Logo" width={1400} height={1400}/>
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Welcome to our ebook reader.</h1>
        {/* <Link
          href="/books"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          prefetch={false}
        >
          View books
        </Link> */}
      </div>
    </div>
  )
}