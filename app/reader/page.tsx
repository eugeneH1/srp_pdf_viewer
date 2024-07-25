'use client'
import Image from 'next/image'
import PdfViewer from '../components/Viewer'
import { useRouter, useSearchParams } from 'next/navigation'
export default function Home() {

  const searchParams = useSearchParams();
  let file_path = searchParams.get('file_path');
  if (file_path) {
    // Remove the first part before the last slash and replace spaces with underscores
    file_path = file_path.substring(file_path.lastIndexOf('/') + 1).replace(/%20/g, '_');
  }
  console.log("file path: ", file_path);

  return (
    <main className='py-2'>
      {file_path? (
        <PdfViewer url={file_path}/>
      ) : (
        <p>Loading...</p>
      )
      }
    </main>
  )
}

