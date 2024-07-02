import Image from 'next/image'
import PdfViewer from './components/PdfViewer'

export default function Home() {
  return (
    <PdfViewer url={"/sample.pdf"}/>
  )
}
