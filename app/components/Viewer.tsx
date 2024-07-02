"use client";
import { ReactElement } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
const PdfViewer = ({ url }: { url: string }) => {
const renderToolbar = (Toolbar: (props: ToolbarProps ) => ReactElement) => (
    <Toolbar>
        {(slots: ToolbarSlot) => {
            const {
                CurrentPageInput,
                EnterFullScreen,
                GoToNextPage,
                GoToPreviousPage,
                NumberOfPages,
                ShowSearchPopover,
                Zoom,
                ZoomIn,
                ZoomOut,
            } = slots;
            return (
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ padding: '0px 2px' }}>
                            <ShowSearchPopover />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomOut />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <Zoom />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomIn />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ padding: '0px 2px', display: 'flex', alignItems: 'center' }}>
                            <GoToPreviousPage />
                            <div style={{ padding: '0px 2px', display: 'flex', alignItems: 'center' }}>
                                <CurrentPageInput /> / <NumberOfPages />
                            </div>
                            <GoToNextPage />
                        </div>
                    </div>
                    <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                        <EnterFullScreen />
                    </div>
                </div>
            );
        }}
    </Toolbar>
);

const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
});

  return (
    <div className="h-screen w-screen">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
};
export default PdfViewer;