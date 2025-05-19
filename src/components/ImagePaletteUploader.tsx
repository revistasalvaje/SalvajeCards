import React from "react";

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
  return (
    <div className="mb-5">
      <div className="mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="block w-full text-xs mb-2"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="btn-secondary py-1.5 px-2 text-xs w-full flex justify-center">
          Examinar...
        </label>
        <p className="text-xs text-text-secondary mt-1">
          {!uploadedBgImage 
            ? "No se ha seleccionado ningún archivo" 
            : "Imagen cargada correctamente"}
        </p>
      </div>

      {uploadedBgImage && (
        <div className="mb-4">
          <img
            src={uploadedBgImage}
            alt="miniatura"
            className="w-full h-auto max-h-32 object-cover rounded mb-2 border"
          />

          <button
            onClick={onApplyImageBg}
            className="btn-primary w-full py-1.5 text-xs"
          >
            Usar como fondo
          </button>
        </div>
      )}

      {palette.length > 0 && (
        <div>
          <h4 className="text-xs font-medium mb-2">Colores extraídos</h4>
          <div className="flex flex-wrap gap-1 min-h-[36px]">
            {palette.map((color, idx) => (
              <button
                key={idx}
                onClick={() => onPaletteClick(color)}
                className="w-6 h-9 border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={`Aplicar color ${idx+1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePaletteUploader;