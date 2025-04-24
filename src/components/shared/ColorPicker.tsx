import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Debug color prop changes
  useEffect(() => {
    console.log(`ColorPicker ${label || 'unknown'} received color:`, color);
  }, [color, label]);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="color-picker-container">
      {label && <label>{label}</label>}
      <div
        className="color-swatch"
        style={{ backgroundColor: color }}
        onClick={() => setShowPicker(!showPicker)}
        title={label || "Seleccionar color"}
      />

      {showPicker && (
        <div className="color-picker-popover" ref={pickerRef}>
          <ChromePicker
            color={color}
            onChange={(color) => onChange(color.hex)}
            disableAlpha
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;