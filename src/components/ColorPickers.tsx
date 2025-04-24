import React, { useRef, useEffect, useState } from "react";
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
  const bgSwatchRef = useRef<HTMLDivElement>(null);
  const textSwatchRef = useRef<HTMLDivElement>(null);

  // Posicionamiento del popover
  const [bgPickerPosition, setBgPickerPosition] = useState({ top: 0, left: 0 });
  const [textPickerPosition, setTextPickerPosition] = useState({ top: 0, left: 0 });

  // Actualizar posición del popover cuando se muestra
  useEffect(() => {
    if (showBgPicker && bgSwatchRef.current) {
      const rect = bgSwatchRef.current.getBoundingClientRect();
      setBgPickerPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX
      });
    }
  }, [showBgPicker]);

  useEffect(() => {
    if (showTextPicker && textSwatchRef.current) {
      const rect = textSwatchRef.current.getBoundingClientRect();
      setTextPickerPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX
      });
    }
  }, [showTextPicker]);

  // Cerrar pickers al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showBgPicker && 
          bgPickerRef.current && 
          !bgPickerRef.current.contains(event.target as Node) &&
          !bgSwatchRef.current?.contains(event.target as Node)) {
        toggleBgPicker();
      }

      if (showTextPicker && 
          textPickerRef.current && 
          !textPickerRef.current.contains(event.target as Node) &&
          !textSwatchRef.current?.contains(event.target as Node)) {
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
            ref={bgSwatchRef}
            onClick={toggleBgPicker} 
            className="color-swatch mt-1" 
            style={{ backgroundColor: bgColor }}
            title="Color de fondo"
          />
          {showBgPicker && (
            <div 
              ref={bgPickerRef}
              className="color-picker-popover"
              style={{
                position: 'fixed',
                top: `${bgPickerPosition.top}px`,
                left: `${bgPickerPosition.left}px`,
                zIndex: 9999
              }}
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
            ref={textSwatchRef}
            onClick={toggleTextPicker}
            className="color-swatch mt-1"
            style={{ backgroundColor: textColor }}
            title="Color de texto"
          />
          {showTextPicker && (
            <div
              ref={textPickerRef}
              className="color-picker-popover"
              style={{
                position: 'fixed',
                top: `${textPickerPosition.top}px`,
                left: `${textPickerPosition.left}px`,
                zIndex: 9999
              }}
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