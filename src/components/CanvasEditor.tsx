import React, { useContext, useEffect, useState } from "react";
import { EditorContext } from "../App";

interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ canvasRef }) => {
  const { canvasInstance } = useContext(EditorContext);
  const [isInitializing, setIsInitializing] = useState(true);

  // Add effect to track canvas initialization
  useEffect(() => {
    if (canvasInstance.current) {
      // When canvas is initialized, hide loading indicator
      setIsInitializing(false);
    }
  }, [canvasInstance.current]);

  return (
    <div className="canvas-container">
      <div className="relative">
        <canvas ref={canvasRef} id="canvas" />

        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center bg-panel bg-opacity-70">
            <div className="text-center p-6">
              <svg className="animate-spin mx-auto h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg font-medium">Inicializando editor...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasEditor;