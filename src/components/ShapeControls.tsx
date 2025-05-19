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
    <div className="card">
      <div className="card-header">Elementos gráficos</div>
      <div className="card-content">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => addShape("line")}
            className="btn btn-secondary"
          >
            Línea
          </button>
          <button
            onClick={() => addShape("arrow")}
            className="btn btn-secondary"
          >
            Flecha
          </button>
          <button
            onClick={() => addShape("rect")}
            className="btn btn-secondary"
          >
            Cuadrado
          </button>
          <button
            onClick={() => addShape("circle")}
            className="btn btn-secondary"
          >
            Círculo
          </button>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="label">Color</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => onStrokeColorChange(e.target.value)}
              className="w-8 h-8 p-0 cursor-pointer"
            />
          </div>
          <div>
            <label className="label">Grosor</label>
            <input
              type="number"
              min={1}
              max={20}
              value={strokeWidth}
              onChange={(e) => onStrokeWidthChange(parseInt(e.target.value))}
              className="input w-16"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeControls;