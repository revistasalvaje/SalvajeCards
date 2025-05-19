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
  quoteFontSize: number;
  signatureFontSize: number;
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
  quoteFontSize,
  signatureFontSize,
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
    <div className="sidebar sidebar-right">
      {/* FONDO SECTION */}
      <div className="section">
        <h2 className="section-title">Fondo</h2>

        {!uploadedBgImage ? (
          <div className="upload-area">
            <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            <span className="text-sm text-gray-500">Subir imagen</span>
            <label className="btn btn-secondary upload-btn mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
              Examinar...
            </label>
          </div>
        ) : (
          <div className="subsection">
            <img
              src={uploadedBgImage}
              alt="miniatura"
              className="w-full h-auto max-h-32 object-cover rounded mb-2 border"
            />

            <button
              onClick={onApplyImageBg}
              className="btn btn-primary w-full"
            >
              Usar como fondo
            </button>
          </div>
        )}

        <div className="subsection">
          <div className="color-controls">
            <div className="color-control">
              <span className="text-sm font-medium block mb-1">Fondo</span>
              <div
                onClick={toggleBgPicker}
                className="w-full h-8 border rounded cursor-pointer"
                style={{ backgroundColor: bgColor }}
              />
            </div>
            <div className="color-control">
              <span className="text-sm font-medium block mb-1">Texto</span>
              <div
                onClick={toggleTextPicker}
                className="w-full h-8 border rounded cursor-pointer"
                style={{ backgroundColor: textColor }}
              />
            </div>
          </div>

          {palette.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-1">Colores extraídos</p>
              <div className="flex flex-wrap gap-1">
                {palette.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPaletteClick(color)}
                    className="w-6 h-6 border rounded hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`Aplicar color ${idx+1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CITA SECTION */}
      <div className="section">
        <h2 className="section-title">Cita</h2>
        <textarea
          value={quote}
          onChange={(e) => onQuoteChange(e.target.value)}
          className="input"
          placeholder="Escribe tu cita aquí..."
        />

        <div className="text-controls">
          <button 
            className="control-btn" 
            onClick={() => onToggleStyle("fontWeight", "bold")}
          >
            B
          </button>
          <button 
            className="control-btn" 
            onClick={() => onToggleStyle("fontStyle", "italic")}
          >
            I
          </button>
          <button 
            className="control-btn" 
            onClick={() => onToggleStyle("underline", true)}
          >
            U
          </button>

          <input
            type="number"
            min={8}
            max={100}
            value={quoteFontSize}
            className="w-12 h-[1.75rem] px-1 border rounded text-center text-xs"
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
          />

          <select
            className="h-[1.75rem] px-1 border rounded text-xs"
            onChange={(e) => onFontChange(e.target.value)}
          >
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans</option>
            <option value="monospace">Mono</option>
          </select>

          <select
            className="h-[1.75rem] px-1 border rounded text-xs"
            onChange={(e) => onAlignChange(e.target.value)}
          >
            <option value="left">Izq</option>
            <option value="center">Centro</option>
            <option value="right">Der</option>
          </select>
        </div>
      </div>

      {/* FIRMA SECTION */}
      <div className="section">
        <h2 className="section-title">Firma</h2>
        <textarea
          value={signature}
          onChange={(e) => onSignatureChange(e.target.value)}
          className="input"
          placeholder="Autor de la cita..."
        />

        <div className="text-controls">
          <button 
            className="control-btn" 
            onClick={() => onToggleSignatureStyle("fontWeight", "bold")}
          >
            B
          </button>
          <button 
            className="control-btn" 
            onClick={() => onToggleSignatureStyle("fontStyle", "italic")}
          >
            I
          </button>
          <button 
            className="control-btn" 
            onClick={() => onToggleSignatureStyle("underline", true)}
          >
            U
          </button>

          <input
            type="number"
            min={8}
            max={100}
            value={signatureFontSize}
            className="w-12 h-[1.75rem] px-1 border rounded text-center text-xs"
            onChange={(e) => onFontSizeSignatureChange(parseInt(e.target.value))}
          />

          <select
            className="h-[1.75rem] px-1 border rounded text-xs"
            onChange={(e) => onFontSignatureChange(e.target.value)}
          >
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans</option>
            <option value="monospace">Mono</option>
          </select>

          <select
            className="h-[1.75rem] px-1 border rounded text-xs"
            onChange={(e) => onAlignSignatureChange(e.target.value)}
          >
            <option value="left">Izq</option>
            <option value="center">Centro</option>
            <option value="right">Der</option>
          </select>
        </div>
      </div>

      {/* FORMAS SECTION */}
      <div className="section">
        <h2 className="section-title">Formas</h2>

        <div className="shapes-grid">
          <button 
            onClick={() => addShape("line")} 
            className="btn btn-secondary"
          >
            Línea
          </button>
          <button 
            onClick={() => addShape("arrow")} 
            className="btn btn-secondary"
          >
            Flecha
          </button>
          <button 
            onClick={() => addShape("rect")} 
            className="btn btn-secondary"
          >
            Rectángulo
          </button>
          <button 
            onClick={() => addShape("circle")} 
            className="btn btn-secondary"
          >
            Círculo
          </button>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="color-swatch" style={{ backgroundColor: strokeColor }}>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => handleStrokeColorChange(e.target.value)}
              className="w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center">
            <input
              type="number"
              min={1}
              max={20}
              value={strokeWidth}
              onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
              className="w-12 border rounded text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;