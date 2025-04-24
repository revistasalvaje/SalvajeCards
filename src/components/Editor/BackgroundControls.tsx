import React, { useState } from 'react';
import ColorPicker from '../shared/ColorPicker';

interface BackgroundControlsProps {
  uploadedBgImage: string | null;
  palette: string[];
  bgColor: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyImageBg: () => void;
  onPaletteClick: (color: string) => void;
  onBgColorChange: (hex: string) => void;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  uploadedBgImage,
  palette,
  bgColor,
  onImageUpload,
  onApplyImageBg,
  onPaletteClick,
  onBgColorChange
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    onImageUpload(e);
  };

  return (
    <section className="section-container">
      <h3>Fondo</h3>

      <div className="file-input-wrapper">
        <label className="file-input-label">
          Subir imagen
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
        {fileName && <div className="file-name">{fileName}</div>}
      </div>

      <div className="control-row">
        <ColorPicker 
          color={bgColor} 
          onChange={onBgColorChange} 
          label="Color de fondo" 
        />
      </div>

      {uploadedBgImage && (
        <>
          <div className="image-preview">
            <img src={uploadedBgImage} alt="Imagen cargada" />
          </div>

          <button
            onClick={onApplyImageBg}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Usar como fondo
          </button>
        </>
      )}

      {palette.length > 0 && (
        <div className="palette-container">
          <div className="palette">
            {palette.map((color, idx) => (
              <div
                key={idx}
                className="palette-color"
                style={{ backgroundColor: color }}
                onClick={() => onPaletteClick(color)}
                title={`Color ${idx + 1}`}
              />
            ))}
          </div>
          <div className="palette-hint">
            Click: fondo | Doble: texto
          </div>
        </div>
      )}
    </section>
  );
};

export default BackgroundControls;