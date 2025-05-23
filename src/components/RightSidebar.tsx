import React, { useRef, useEffect, useState } from "react";
import { ChromePicker } from "react-color";

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
  const bgPickerRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);

  // Estados para controlar botones de estilo
  const [quoteStyles, setQuoteStyles] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  const [signatureStyles, setSignatureStyles] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showBgPicker && bgPickerRef.current && !bgPickerRef.current.contains(event.target as Node)) {
        toggleBgPicker();
      }
      if (showTextPicker && textPickerRef.current && !textPickerRef.current.contains(event.target as Node)) {
        toggleTextPicker();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBgPicker, showTextPicker, toggleBgPicker, toggleTextPicker]);

  // Manejar toggle de estilos para cita
  const handleQuoteStyleToggle = (style: 'bold' | 'italic' | 'underline') => {
    const newState = !quoteStyles[style];
    setQuoteStyles(prev => ({ ...prev, [style]: newState }));

    let styleKey = style;
    let styleValue: any = newState;

    if (style === 'bold') {
      styleKey = 'fontWeight';
      styleValue = newState ? 'bold' : 'normal';
    } else if (style === 'italic') {
      styleKey = 'fontStyle';
      styleValue = newState ? 'italic' : 'normal';
    }

    onToggleStyle(styleKey, styleValue);
  };

  // Manejar toggle de estilos para firma
  const handleSignatureStyleToggle = (style: 'bold' | 'italic' | 'underline') => {
    const newState = !signatureStyles[style];
    setSignatureStyles(prev => ({ ...prev, [style]: newState }));

    let styleKey = style;
    let styleValue: any = newState;

    if (style === 'bold') {
      styleKey = 'fontWeight';
      styleValue = newState ? 'bold' : 'normal';
    } else if (style === 'italic') {
      styleKey = 'fontStyle';
      styleValue = newState ? 'italic' : 'normal';
    }

    onToggleSignatureStyle(styleKey, styleValue);
  };

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
            <span className="text-sm text-gray-500 mb-2">Subir imagen</span>
            <label className="btn btn-secondary">
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
              className="w-full h-auto max-h-32 object-cover rounded-lg mb-3 border"
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
              <label>Fondo</label>
              <div
                onClick={toggleBgPicker}
                className="color-swatch"
                style={{ backgroundColor: bgColor || "#ffffff" }}
              />
              {showBgPicker && (
                <div ref={bgPickerRef} className="color-picker-dropdown">
                  <ChromePicker
                    color={bgColor}
                    onChange={(color) => onBgColorChange(color.hex)}
                    disableAlpha
                  />
                </div>
              )}
            </div>

            <div className="color-control">
              <label>Texto</label>
              <div
                onClick={toggleTextPicker}
                className="color-swatch"
                style={{ backgroundColor: textColor || "#000000" }}
              />
              {showTextPicker && (
                <div ref={textPickerRef} className="color-picker-dropdown">
                  <ChromePicker
                    color={textColor}
                    onChange={(color) => onTextColorChange(color.hex)}
                    disableAlpha
                  />
                </div>
              )}
            </div>
          </div>

          {palette.length > 0 && (
            <div>
              <p className="subsection-title">Colores extraídos</p>
              <div className="flex flex-wrap gap-2">
                {palette.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPaletteClick(color)}
                    className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:scale-110 transition-transform hover:border-blue-400"
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
          rows={3}
        />

        <div className="text-controls">
          <button 
            className={`control-btn ${quoteStyles.bold ? 'active' : ''}`}
            onClick={() => handleQuoteStyleToggle('bold')}
            title="Negrita"
          >
            <strong>B</strong>
          </button>
          <button 
            className={`control-btn ${quoteStyles.italic ? 'active' : ''}`}
            onClick={() => handleQuoteStyleToggle('italic')}
            title="Cursiva"
          >
            <em>I</em>
          </button>
          <button 
            className={`control-btn ${quoteStyles.underline ? 'active' : ''}`}
            onClick={() => handleQuoteStyleToggle('underline')}
            title="Subrayado"
          >
            <u>U</u>
          </button>

          <input
            type="number"
            min={8}
            max={100}
            value={quoteFontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
            title="Tamaño"
          />

          <select
            onChange={(e) => onFontChange(e.target.value)}
            title="Fuente"
            defaultValue="serif"
          >
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans</option>
            <option value="monospace">Mono</option>
          </select>

          <select
            onChange={(e) => onAlignChange(e.target.value)}
            title="Alineación"
            defaultValue="center"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
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
          rows={2}
        />

        <div className="text-controls">
          <button 
            className={`control-btn ${signatureStyles.bold ? 'active' : ''}`}
            onClick={() => handleSignatureStyleToggle('bold')}
            title="Negrita"
          >
            <strong>B</strong>
          </button>
          <button 
            className={`control-btn ${signatureStyles.italic ? 'active' : ''}`}
            onClick={() => handleSignatureStyleToggle('italic')}
            title="Cursiva"
          >
            <em>I</em>
          </button>
          <button 
            className={`control-btn ${signatureStyles.underline ? 'active' : ''}`}
            onClick={() => handleSignatureStyleToggle('underline')}
            title="Subrayado"
          >
            <u>U</u>
          </button>

          <input
            type="number"
            min={8}
            max={100}
            value={signatureFontSize}
            onChange={(e) => onFontSizeSignatureChange(parseInt(e.target.value))}
            title="Tamaño"
          />

          <select
            onChange={(e) => onFontSignatureChange(e.target.value)}
            title="Fuente"
            defaultValue="serif"
          >
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans</option>
            <option value="monospace">Mono</option>
          </select>

          <select
            onChange={(e) => onAlignSignatureChange(e.target.value)}
            title="Alineación"
            defaultValue="center"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
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

        <div className="shape-properties">
          <div className="shape-property">
            <label>Color</label>
            <div className="color-swatch" style={{ backgroundColor: strokeColor }}>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => handleStrokeColorChange(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
              />
            </div>
          </div>

          <div className="shape-property">
            <label>Grosor</label>
            <input
              type="number"
              min={1}
              max={20}
              value={strokeWidth}
              onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;