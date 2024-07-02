import Image from 'next/image'
import Viewer from './components/PdfViewer'
import PdfViewer from './components/Viewer'
export default function Home() {
  return (
    <PdfViewer url={"/sample.pdf"}/>
  )
}
