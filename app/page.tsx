import Image from 'next/image'
import PdfViewer from './components/Viewer'
export default function Home() {
  return (
    <PdfViewer url={"/sample.pdf"}/>
  )
}
