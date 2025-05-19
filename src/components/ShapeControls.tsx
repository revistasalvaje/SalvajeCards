import React from "react";

interface ShapeControlsProps {
  strokeColor: string;
  strokeWidth: number;
  addShape: (type: "line" | "arrow" | "rect" | "circle") => void;
  onStrokeColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
}

const ShapeControls: React.FC<ShapeControlsProps> = ({
  strokeColor,
  strokeWidth,
  addShape,
  onStrokeColorChange,
  onStrokeWidthChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3">Insertar formas</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={() => addShape("line")} 
          className="btn-secondary py-1.5 text-xs"
        >
          Línea
        </button>
        <button 
          onClick={() => addShape("arrow")} 
          className="btn-secondary py-1.5 text-xs"
        >
          Flecha
        </button>
        <button 
          onClick={() => addShape("rect")} 
          className="btn-secondary py-1.5 text-xs"
        >
          Cuadrado
        </button>
        <button 
          onClick={() => addShape("circle")} 
          className="btn-secondary py-1.5 text-xs"
        >
          Círculo
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start gap-1">
          <label className="text-xs font-medium">Color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className="w-8 h-8 p-0 border rounded cursor-pointer"
          />
        </div>
        <div className="flex flex-col items-start gap-1">
          <label className="text-xs font-medium">Grosor</label>
          <input
            type="number"
            min={1}
            max={20}
            value={strokeWidth}
            onChange={(e) => onStrokeWidthChange(parseInt(e.target.value))}
            className="w-16 p-1 border rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ShapeControls;