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
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3">Colores</h3>
      <div className="flex items-start gap-6">
        {/* Fondo */}
        <div className="relative">
          <label className="text-xs font-medium block mb-2">Fondo</label>
          <div
            onClick={toggleBgPicker}
            className="color-swatch"
            style={{
              backgroundColor: bgColor,
            }}
          />
          {showBgPicker && (
            <div 
              ref={bgPickerRef}
              className="absolute z-50 mt-2"
            >
              <div className="shadow-md">
                <ChromePicker
                  color={bgColor}
                  onChange={(c) => onBgColorChange(c.hex)}
                  disableAlpha
                />
              </div>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="relative">
          <label className="text-xs font-medium block mb-2">Texto</label>
          <div
            onClick={toggleTextPicker}
            className="color-swatch"
            style={{
              backgroundColor: textColor,
            }}
          />
          {showTextPicker && (
            <div
              ref={textPickerRef}
              className="absolute z-50 mt-2"
            >
              <div className="shadow-md">
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