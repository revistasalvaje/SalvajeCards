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
      <h3 className="text-sm font-semibold mb-2">Insertar formas</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button 
          onClick={() => addShape("line")} 
          className="border px-3 py-1.5 text-xs rounded hover:bg-gray-100 transition-colors"
        >
          Línea
        </button>
        <button 
          onClick={() => addShape("arrow")} 
          className="border px-3 py-1.5 text-xs rounded hover:bg-gray-100 transition-colors"
        >
          Flecha
        </button>
        <button 
          onClick={() => addShape("rect")} 
          className="border px-3 py-1.5 text-xs rounded hover:bg-gray-100 transition-colors"
        >
          Cuadrado
        </button>
        <button 
          onClick={() => addShape("circle")} 
          className="border px-3 py-1.5 text-xs rounded hover:bg-gray-100 transition-colors"
        >
          Círculo
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium">Color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className="w-8 h-8 p-0 border rounded cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
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