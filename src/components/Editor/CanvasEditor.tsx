import React, { useContext } from "react";
import { EditorContext } from "../App";

interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ canvasRef }) => {
  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} id="canvas" />
    </div>
  );
};

export default CanvasEditor;