// src/components/ShapeControls.tsx

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
      <div className="flex gap-2 mb-2 flex-wrap">
        <button onClick={() => addShape("line")} className="border px-2 py-1 text-xs rounded">Línea</button>
        <button onClick={() => addShape("arrow")} className="border px-2 py-1 text-xs rounded">Flecha</button>
        <button onClick={() => addShape("rect")} className="border px-2 py-1 text-xs rounded">Cuadrado</button>
        <button onClick={() => addShape("circle")} className="border px-2 py-1 text-xs rounded">Círculo</button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Color</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => onStrokeColorChange(e.target.value)}
          className="w-8 h-8 p-0 border rounded"
        />
        <label className="text-sm">Grosor</label>
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
  );
};

export default ShapeControls;
