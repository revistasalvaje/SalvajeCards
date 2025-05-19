import React, { useRef, useState } from "react";

interface ImageUploaderProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyImage: () => void;
  uploadedImage: string | null;
  palette: string[];
  onPaletteClick: (color: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onApplyImage,
  uploadedImage,
  palette,
  onPaletteClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="card">
      <div className="card-header">Subir imagen</div>
      <div className="card-content">
        <div 
          className="file-upload-container"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept="image/*"
            onChange={onImageUpload}
          />

          {uploadedImage ? (
            <div>
              <img 
                src={uploadedImage} 
                alt="Vista previa" 
                className="w-full max-h-32 object-contain mb-2 rounded"
              />
            </div>
          ) : (
            <div className="text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mx-auto h-10 w-10 text-secondary mb-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-sm">
                Haz clic para seleccionar una imagen
              </p>
              <p className="text-xs text-secondary">
                o arrastra y suelta aquí
              </p>
            </div>
          )}
        </div>

        {uploadedImage && (
          <button 
            className="btn btn-primary w-full mb-4"
            onClick={onApplyImage}
          >
            Usar como fondo
          </button>
        )}

        {palette.length > 0 && (
          <div>
            <p className="heading-3">Colores extraídos</p>
            <div className="flex flex-wrap gap-2">
              {palette.map((color, index) => (
                <button
                  key={index}
                  onClick={() => onPaletteClick(color)}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  title={`Color ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;