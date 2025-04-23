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
    <div className="control-group">
      <h3>Insertar formas</h3>

      <div className="grid grid-cols-2 gap-1 mb-3">
        <button 
          onClick={() => addShape("line")} 
          className="action-button"
        >
          Línea
        </button>
        <button 
          onClick={() => addShape("arrow")} 
          className="action-button"
        >
          Flecha
        </button>
        <button 
          onClick={() => addShape("rect")} 
          className="action-button"
        >
          Cuadrado
        </button>
        <button 
          onClick={() => addShape("circle")} 
          className="action-button"
        >
          Círculo
        </button>
      </div>

      <div className="controls-row">
        <div className="flex items-center">
          <label className="mr-2 !inline-block">Color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className="color-swatch !w-6 !h-6"
          />
        </div>

        <div className="flex items-center ml-3">
          <label className="mr-2 !inline-block">Grosor</label>
          <input
            type="number"
            min={1}
            max={20}
            value={strokeWidth}
            onChange={(e) => onStrokeWidthChange(parseInt(e.target.value))}
            className="w-12 text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default ShapeControls;