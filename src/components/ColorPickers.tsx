import React, { useRef, useEffect } from "react";
import { ChromePicker } from "react-color";

interface ColorPickersProps {
  bgColor: string;
  textColor: string;
  showBgPicker: boolean;
  showTextPicker: boolean;
  toggleBgPicker: () => void;
  toggleTextPicker: () => void;
  onBgColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
}

const ColorPickers: React.FC<ColorPickersProps> = ({
  bgColor,
  textColor,
  showBgPicker,
  showTextPicker,
  toggleBgPicker,
  toggleTextPicker,
  onBgColorChange,
  onTextColorChange,
}) => {
  const bgPickerRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);

  // Cerrar pickers al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showBgPicker && 
          bgPickerRef.current && 
          !bgPickerRef.current.contains(event.target as Node)) {
        toggleBgPicker();
      }

      if (showTextPicker && 
          textPickerRef.current && 
          !textPickerRef.current.contains(event.target as Node)) {
        toggleTextPicker();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBgPicker, showTextPicker, toggleBgPicker, toggleTextPicker]);

  return (
    <div className="control-group">
      <h3>Colores</h3>

      <div className="controls-row items-center">
        <div className="relative flex-1">
          <label>Fondo</label>
          <div 
            onClick={toggleBgPicker} 
            className="color-swatch mt-1" 
            style={{ backgroundColor: bgColor }}
            title="Color de fondo"
          />
          {showBgPicker && (
            <div 
              ref={bgPickerRef}
              className="absolute z-50 mt-1"
            >
              <div className="shadow-lg">
                <ChromePicker
                  color={bgColor}
                  onChange={(c) => onBgColorChange(c.hex)}
                  disableAlpha
                />
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <label>Texto</label>
          <div
            onClick={toggleTextPicker}
            className="color-swatch mt-1"
            style={{ backgroundColor: textColor }}
            title="Color de texto"
          />
          {showTextPicker && (
            <div
              ref={textPickerRef}
              className="absolute z-50 mt-1"
            >
              <div className="shadow-lg">
                <ChromePicker
                  color={textColor}
                  onChange={(c) => onTextColorChange(c.hex)}
                  disableAlpha
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPickers;