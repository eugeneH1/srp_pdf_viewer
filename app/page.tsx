import PdfViewer from "./components/Viewer";

export default function Home() {
  return (
    <main className='py-'>
      <PdfViewer url={'/Digital_Business_Primer.pdf'}/>
    </main>
  )
}