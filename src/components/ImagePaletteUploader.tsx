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
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">Paleta</h3>

      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="block w-full text-sm mb-2"
      />

      {uploadedBgImage && (
        <div className="mb-3">
          <img
            src={uploadedBgImage}
            alt="miniatura"
            className="w-full h-auto max-h-32 object-cover rounded mb-2 border"
          />

          <button
            onClick={onApplyImageBg}
            className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded hover:bg-gray-700"
          >
            Usar como fondo
          </button>
        </div>
      )}

      {palette.length > 0 && (
        <div className="flex flex-wrap gap-1 min-h-[36px]">
          {palette.map((color, idx) => (
            <button
              key={idx}
              onClick={() => onPaletteClick(color)}
              className="w-6 h-9 border"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagePaletteUploader;
