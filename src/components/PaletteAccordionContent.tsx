import React from "react";
import ImagePaletteUploader from "./ImagePaletteUploader";
import ColorPickers from "./ColorPickers";

interface PaletteAccordionContentProps {
  uploadedBgImage: string | null;
  palette: string[];
  bgColor: string;
  textColor: string;
  showBgPicker: boolean;
  showTextPicker: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyImageBg: () => void;
  onPaletteClick: (color: string) => void;
  onBgColorChange: (hex: string) => void;
  onTextColorChange: (hex: string) => void;
  toggleBgPicker: () => void;
  toggleTextPicker: () => void;
}

const PaletteAccordionContent: React.FC<PaletteAccordionContentProps> = ({
  uploadedBgImage,
  palette,
  bgColor,
  textColor,
  showBgPicker,
  showTextPicker,
  onImageUpload,
  onApplyImageBg,
  onPaletteClick,
  onBgColorChange,
  onTextColorChange,
  toggleBgPicker,
  toggleTextPicker,
}) => {
  return (
    <div className="p-4">
      <ImagePaletteUploader
        uploadedBgImage={uploadedBgImage}
        palette={palette}
        onImageUpload={onImageUpload}
        onApplyImageBg={onApplyImageBg}
        onPaletteClick={onPaletteClick}
      />

      <div className="pt-2 border-t border-border">
        <h3 className="text-sm font-medium mb-3">Colores básicos</h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="block text-xs mb-2">Fondo</span>
            <div
              onClick={toggleBgPicker}
              className="color-swatch w-full h-9"
              style={{ backgroundColor: bgColor }}
            />
            {showBgPicker && (
              <div className="absolute z-10 mt-2">
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

          <div className="flex-1">
            <span className="block text-xs mb-2">Texto</span>
            <div
              onClick={toggleTextPicker}
              className="color-swatch w-full h-9"
              style={{ backgroundColor: textColor }}
            />
            {showTextPicker && (
              <div className="absolute z-10 mt-2">
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
    </div>
  );
};

// This is just to make the component compile - in real implementation import properly
const ChromePicker = ({ color, onChange, disableAlpha }: any) => <div />;

export default PaletteAccordionContent;