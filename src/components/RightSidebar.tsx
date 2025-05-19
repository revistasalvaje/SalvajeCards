import React from "react";

interface RightSidebarProps {
  uploadedBgImage: string | null;
  palette: string[];
  bgColor: string;
  textColor: string;
  showBgPicker: boolean;
  showTextPicker: boolean;
  quote: string;
  signature: string;
  strokeColor: string;
  strokeWidth: number;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyImageBg: () => void;
  onPaletteClick: (color: string) => void;
  onBgColorChange: (hex: string) => void;
  onTextColorChange: (hex: string) => void;
  toggleBgPicker: () => void;
  toggleTextPicker: () => void;
  onQuoteChange: (text: string) => void;
  onSignatureChange: (text: string) => void;
  onToggleStyle: (style: string, value: any) => void;
  onToggleSignatureStyle: (style: string, value: any) => void;
  onFontSizeChange: (size: number) => void;
  onFontSizeSignatureChange: (size: number) => void;
  onFontChange: (font: string) => void;
  onFontSignatureChange: (font: string) => void;
  onAlignChange: (align: string) => void;
  onAlignSignatureChange: (align: string) => void;
  addShape: (type: "line" | "arrow" | "rect" | "circle") => void;
  handleStrokeColorChange: (color: string) => void;
  handleStrokeWidthChange: (width: number) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  uploadedBgImage,
  palette,
  bgColor,
  textColor,
  showBgPicker,
  showTextPicker,
  quote,
  signature,
  strokeColor,
  strokeWidth,
  onImageUpload,
  onApplyImageBg,
  onPaletteClick,
  onBgColorChange,
  onTextColorChange,
  toggleBgPicker,
  toggleTextPicker,
  onQuoteChange,
  onSignatureChange,
  onToggleStyle,
  onToggleSignatureStyle,
  onFontSizeChange,
  onFontSizeSignatureChange,
  onFontChange,
  onFontSignatureChange,
  onAlignChange,
  onAlignSignatureChange,
  addShape,
  handleStrokeColorChange,
  handleStrokeWidthChange,
}) => {
  return (
    <div className="p-4 overflow-y-auto h-full bg-white">
      <h2 className="text-lg font-semibold mb-4">Editor</h2>

      {/* PALETTE SECTION */}
      <div className="mb-4 border rounded-md overflow-hidden">
        <div className="p-3 bg-gray-50 border-b font-medium">
          Paleta de colores
        </div>
        <div className="p-4">
          {/* Image Uploader Section */}
          <div className="mb-4">
            <div className="mb-3">
              <label className="inline-block px-3 py-2 bg-gray-50 border rounded-md mb-2 w-full text-center text-sm cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                />
                Examinar...
              </label>
              <p className="text-xs text-gray-500 mt-1">
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
                  className="w-full py-1.5 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Usar como fondo
                </button>
              </div>
            )}

            {palette.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium mb-1 text-gray-600">Colores extraídos</h4>
                <div className="flex flex-wrap gap-1">
                  {palette.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => onPaletteClick(color)}
                      className="w-6 h-8 border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={`Aplicar color ${idx+1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color Controls Section */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-gray-600">Colores básicos</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <span className="text-xs block mb-1">Fondo</span>
                <div
                  onClick={toggleBgPicker}
                  className="w-full h-8 rounded border cursor-pointer"
                  style={{ backgroundColor: bgColor }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs block mb-1">Texto</span>
                <div
                  onClick={toggleTextPicker}
                  className="w-full h-8 rounded border cursor-pointer"
                  style={{ backgroundColor: textColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEXT SECTION */}
      <div className="mb-4 border rounded-md overflow-hidden">
        <div className="p-3 bg-gray-50 border-b font-medium">
          Contenido de texto
        </div>
        <div className="p-4">
          {/* Quote Controls */}
          <div className="mb-6">
            <h3 className="text-xs font-medium mb-2 text-gray-600">Cita</h3>
            <textarea
              value={quote}
              onChange={(e) => onQuoteChange(e.target.value)}
              className="w-full p-2 text-sm mb-3 border rounded resize-none"
              rows={3}
              placeholder="Ingresa un texto inspirador..."
            />

            <div className="flex flex-wrap gap-1">
              {["bold", "italic", "underline"].map((style) => (
                <button
                  key={style}
                  className="w-8 h-8 border rounded flex items-center justify-center"
                  onClick={() => onToggleStyle(style, true)}
                >
                  {style[0].toUpperCase()}
                </button>
              ))}

              <input
                type="number"
                min={8}
                max={100}
                value={quoteFontSize}
                className="w-14 px-2 py-1 border text-center text-xs"
                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
              />

              <select
                className="px-2 py-1 border text-xs"
                onChange={(e) => onFontChange(e.target.value)}
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans</option>
                <option value="monospace">Mono</option>
              </select>

              <select
                className="px-2 py-1 border text-xs"
                onChange={(e) => onAlignChange(e.target.value)}
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>

          {/* Signature Controls */}
          <div>
            <h3 className="text-xs font-medium mb-2 text-gray-600">Firma</h3>
            <textarea
              value={signature}
              onChange={(e) => onSignatureChange(e.target.value)}
              className="w-full p-2 text-sm mb-3 border rounded resize-none"
              rows={2}
              placeholder="Agrega una firma o autor..."
            />

            <div className="flex flex-wrap gap-1">
              {["bold", "italic", "underline"].map((style) => (
                <button
                  key={style}
                  className="w-8 h-8 border rounded flex items-center justify-center"
                  onClick={() => onToggleSignatureStyle(style, true)}
                >
                  {style[0].toUpperCase()}
                </button>
              ))}

              <input
                type="number"
                min={8}
                max={100}
                value={signatureFontSize}
                className="w-14 px-2 py-1 border text-center text-xs"
                onChange={(e) => onFontSizeSignatureChange(parseInt(e.target.value))}
              />

              <select
                className="px-2 py-1 border text-xs"
                onChange={(e) => onFontSignatureChange(e.target.value)}
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans</option>
                <option value="monospace">Mono</option>
              </select>

              <select
                className="px-2 py-1 border text-xs"
                onChange={(e) => onAlignSignatureChange(e.target.value)}
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SHAPES SECTION */}
      <div className="mb-4 border rounded-md overflow-hidden">
        <div className="p-3 bg-gray-50 border-b font-medium">
          Elementos gráficos
        </div>
        <div className="p-4">
          <h3 className="text-xs font-medium mb-3 text-gray-600">Insertar formas</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button 
              onClick={() => addShape("line")} 
              className="py-1.5 px-3 text-xs border rounded bg-gray-50 hover:bg-gray-100"
            >
              Línea
            </button>
            <button 
              onClick={() => addShape("arrow")} 
              className="py-1.5 px-3 text-xs border rounded bg-gray-50 hover:bg-gray-100"
            >
              Flecha
            </button>
            <button 
              onClick={() => addShape("rect")} 
              className="py-1.5 px-3 text-xs border rounded bg-gray-50 hover:bg-gray-100"
            >
              Cuadrado
            </button>
            <button 
              onClick={() => addShape("circle")} 
              className="py-1.5 px-3 text-xs border rounded bg-gray-50 hover:bg-gray-100"
            >
              Círculo
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Color</label>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => handleStrokeColorChange(e.target.value)}
                className="w-8 h-8 p-0 border rounded cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Grosor</label>
              <input
                type="number"
                min={1}
                max={20}
                value={strokeWidth}
                onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
                className="w-16 p-1 border rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;