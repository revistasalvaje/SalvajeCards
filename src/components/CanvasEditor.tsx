import React, { useContext } from "react";
import { EditorContext } from "../App";

interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ canvasRef }) => {
  const { canvasInstance } = useContext(EditorContext);

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} id="canvas" />

      {!canvasInstance.current && (
        <div 
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <div style={{ textAlign: "center", padding: "16px" }}>
            <div className="spinner" style={{ 
              margin: "0 auto", 
              width: "32px", 
              height: "32px", 
              borderWidth: "3px", 
              marginBottom: "16px" 
            }}></div>
            <p style={{ fontSize: "16px", fontWeight: 500 }}>Inicializando editor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;