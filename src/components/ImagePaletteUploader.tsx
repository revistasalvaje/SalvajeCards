import React, { useState } from "react";

interface ImagePaletteUploaderProps {
  uploadedBgImage: string | null;
  palette: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyImageBg: () => void;
  onPaletteClick: (color: string) => void;
}

const ImagePaletteUploader: React.FC<ImagePaletteUploaderProps> = ({
  uploadedBgImage,
  palette,
  onImageUpload,
  onApplyImageBg,
  onPaletteClick,
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    onImageUpload(e);
  };

  return (
    <div className="control-group">
      <h3>Imagen</h3>

      <div className="file-input-wrapper w-full mb-2">
        <label className="file-input-label w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
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

      {uploadedBgImage && (
        <div className="mb-3">
          <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden mb-2">
            <img
              src={uploadedBgImage}
              alt="Imagen cargada"
              className="w-full h-full object-contain"
            />
          </div>

          <button
            onClick={onApplyImageBg}
            className="action-button primary w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Usar como fondo
          </button>
        </div>
      )}

      {palette.length > 0 && (
        <div className="control-group">
          <h3>Paleta de colores</h3>
          <div className="palette">
            {palette.map((color, idx) => (
              <button
                key={idx}
                onClick={() => onPaletteClick(color)}
                className="palette-color"
                style={{ backgroundColor: color }}
                title={`Color de paleta ${idx + 1}`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500">
            Click: color de fondo | Doble click: color de texto
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePaletteUploader;