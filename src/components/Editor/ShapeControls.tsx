import React from 'react';
import ColorPicker from '../shared/ColorPicker';

interface ShapeControlsProps {
  strokeColor: string;
  strokeWidth: number;
  addShape: (type: "line" | "arrow" | "rect" | "circle") => void;
  handleStrokeColorChange: (color: string) => void;
  handleStrokeWidthChange: (width: number) => void;
}

const ShapeControls: React.FC<ShapeControlsProps> = ({
  strokeColor,
  strokeWidth,
  addShape,
  handleStrokeColorChange,
  handleStrokeWidthChange
}) => {
  return (
    <section className="section-container">
      <h3>Formas</h3>
      <div className="shapes-grid">
        <button onClick={() => addShape("line")} className="shape-button">Línea</button>
        <button onClick={() => addShape("arrow")} className="shape-button">Flecha</button>
        <button onClick={() => addShape("rect")} className="shape-button">Rectángulo</button>
        <button onClick={() => addShape("circle")} className="shape-button">Círculo</button>
      </div>

      <div className="control-row shape-controls">
        <div className="control-item">
          <ColorPicker 
            color={strokeColor} 
            onChange={handleStrokeColorChange}
            label="Color de trazo"
          />
        </div>

        <div className="stroke-width-control control-item">
          <input
            type="number"
            min={1}
            max={20}
            value={strokeWidth}
            onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
          />
        </div>
      </div>
    </section>
  );
};

export default ShapeControls;