import React from "react";

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  onToggle: () => void;
  isOpen: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  color,
  onChange,
  onToggle,
  isOpen,
}) => {
  return (
    <div className="color-picker-container">
      <label className="label">{label}</label>
      <div
        className="color-swatch"
        style={{ backgroundColor: color }}
        onClick={onToggle}
        title={`Elegir color de ${label.toLowerCase()}`}
      />
      {isOpen && (
        <div className="color-picker-dropdown">
          {/* Replace with your preferred color picker component */}
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="color-input"
          />
        </div>
      )}
    </div>
  );
};

interface ColorControlsProps {
  bgColor: string;
  textColor: string;
  onBgColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  showBgPicker: boolean;
  showTextPicker: boolean;
  toggleBgPicker: () => void;
  toggleTextPicker: () => void;
}

const ColorControls: React.FC<ColorControlsProps> = ({
  bgColor,
  textColor,
  onBgColorChange,
  onTextColorChange,
  showBgPicker,
  showTextPicker,
  toggleBgPicker,
  toggleTextPicker,
}) => {
  return (
    <div className="card">
      <div className="card-header">Colores básicos</div>
      <div className="card-content">
        <div className="flex gap-4">
          <div className="flex-1">
            <ColorPicker
              label="Fondo"
              color={bgColor}
              onChange={onBgColorChange}
              onToggle={toggleBgPicker}
              isOpen={showBgPicker}
            />
          </div>
          <div className="flex-1">
            <ColorPicker
              label="Texto"
              color={textColor}
              onChange={onTextColorChange}
              onToggle={toggleTextPicker}
              isOpen={showTextPicker}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorControls;