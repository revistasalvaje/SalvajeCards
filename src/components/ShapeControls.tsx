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
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Insertar formas</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        <button 
          onClick={() => addShape("line")} 
          className="bg-gray-100 text-xs px-2 py-1 rounded border hover:bg-gray-200"
        >
          Línea
        </button>
        <button 
          onClick={() => addShape("arrow")} 
          className="bg-gray-100 text-xs px-2 py-1 rounded border hover:bg-gray-200"
        >
          Flecha
        </button>
        <button 
          onClick={() => addShape("rect")} 
          className="bg-gray-100 text-xs px-2 py-1 rounded border hover:bg-gray-200"
        >
          Cuadrado
        </button>
        <button 
          onClick={() => addShape("circle")} 
          className="bg-gray-100 text-xs px-2 py-1 rounded border hover:bg-gray-200"
        >
          Círculo
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <label className="text-xs">Color:</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => onStrokeColorChange(e.target.value)}
          className="w-6 h-6 p-0 border rounded"
        />
        <label className="text-xs ml-2">Grosor:</label>
        <input
          type="number"
          min={1}
          max={20}
          value={strokeWidth}
          onChange={(e) => onStrokeWidthChange(parseInt(e.target.value))}
          className="w-12 p-1 border rounded text-xs"
        />
      </div>
    </div>
  );
};

export default ShapeControls;