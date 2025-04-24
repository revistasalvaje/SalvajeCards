import React, { useEffect, useState, useContext } from 'react';
import ColorPicker from './ColorPicker';
import { useTemplateManager } from '../hooks/useTemplateManager';

interface RightSidebarProps {
  uploadedBgImage: string | null;
  palette: string[];
  bgColor: string;
  textColor: string;
  showBgPicker: boolean;
  showTextPicker: boolean;
  quote: string;
  signature: string;
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
  onFontSizeChange: (size: number) => void;
  onFontSizeSignatureChange: (size: number) => void;
  onFontChange: (font: string) => void;
  onFontSignatureChange: (font: string) => void;
  onAlignChange: (align: string) => void;
  onAlignSignatureChange: (align: string) => void;
  addShape: (type: "line" | "arrow" | "rect" | "circle") => void;
  handleStrokeColorChange: (color: string) => void;
  handleStrokeWidthChange: (width: number) => void;
  strokeColor: string;
  strokeWidth: number;
}

const UpdatedRightSidebar: React.FC<RightSidebarProps> = ({
  uploadedBgImage,
  palette,
  bgColor,
  textColor,
  showBgPicker,
  showTextPicker,
  quote,
  signature,
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
  onFontSizeChange,
  onFontSizeSignatureChange,
  onFontChange,
  onFontSignatureChange,
  onAlignChange,
  onAlignSignatureChange,
  addShape,
  handleStrokeColorChange,
  handleStrokeWidthChange,
  strokeColor,
  strokeWidth
}) => {
  // Usar valores directamente del gestor de plantillas
  const {
    currentBgColor,
    currentTextColor,
    currentQuoteFontSize,
    currentSignatureFontSize,
    currentQuoteFont,
    currentSignatureFont,
    currentQuoteAlign,
    currentSignatureAlign
  } = useTemplateManager();

  const [fileName, setFileName] = useState<string>("");

  // Estados locales para controladores
  const [quoteFontSize, setQuoteFontSize] = useState(48);
  const [signatureFontSize, setSignatureFontSize] = useState(32);
  const [quoteFont, setQuoteFont] = useState("serif");
  const [signatureFont, setSignatureFont] = useState("serif");
  const [quoteAlign, setQuoteAlign] = useState("left");
  const [signatureAlign, setSignatureAlign] = useState("right");

  // Sincronizar estados cuando cambian los valores del template manager
  useEffect(() => {
    if (currentQuoteFontSize) {
      setQuoteFontSize(currentQuoteFontSize);
    }
  }, [currentQuoteFontSize]);

  useEffect(() => {
    if (currentSignatureFontSize) {
      setSignatureFontSize(currentSignatureFontSize);
    }
  }, [currentSignatureFontSize]);

  useEffect(() => {
    if (currentQuoteFont) {
      setQuoteFont(currentQuoteFont);
    }
  }, [currentQuoteFont]);

  useEffect(() => {
    if (currentSignatureFont) {
      setSignatureFont(currentSignatureFont);
    }
  }, [currentSignatureFont]);

  useEffect(() => {
    if (currentQuoteAlign) {
      setQuoteAlign(currentQuoteAlign);
    }
  }, [currentQuoteAlign]);

  useEffect(() => {
    if (currentSignatureAlign) {
      setSignatureAlign(currentSignatureAlign);
    }
  }, [currentSignatureAlign]);

  // Logging para debug
  useEffect(() => {
    console.log("🔄 Sidebar - Color de fondo actualizado:", currentBgColor);
  }, [currentBgColor]);

  useEffect(() => {
    console.log("🔄 Sidebar - Color de texto actualizado:", currentTextColor);
  }, [currentTextColor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    onImageUpload(e);
  };

  // Manejadores con actualización de estado local
  const handleQuoteFontSizeChange = (size: number) => {
    setQuoteFontSize(size);
    onFontSizeChange(size);
  };

  const handleSignatureFontSizeChange = (size: number) => {
    setSignatureFontSize(size);
    onFontSizeSignatureChange(size);
  };

  const handleQuoteFontChange = (font: string) => {
    setQuoteFont(font);
    onFontChange(font);
  };

  const handleSignatureFontChange = (font: string) => {
    setSignatureFont(font);
    onFontSignatureChange(font);
  };

  const handleQuoteAlignChange = (align: string) => {
    setQuoteAlign(align);
    onAlignChange(align);
  };

  const handleSignatureAlignChange = (align: string) => {
    setSignatureAlign(align);
    onAlignSignatureChange(align);
  };

  return (
    <div className="sidebar right-sidebar">
      <section className="section-container">
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

        <div className="control-row color-controls">
          <ColorPicker 
            color={currentBgColor || bgColor} 
            onChange={onBgColorChange} 
            label="Fondo" 
          />

          <ColorPicker 
            color={currentTextColor || textColor} 
            onChange={onTextColorChange} 
            label="Texto" 
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

      <section className="section-container">
        <h3>Cita</h3>
        <textarea
          value={quote}
          onChange={(e) => onQuoteChange(e.target.value)}
          rows={3}
          placeholder="Escribe tu cita aquí..."
        />

        <div className="text-controls">
          <button
            className="style-button"
            onClick={() => onToggleStyle("fontWeight", "bold")}
            title="Negrita"
          >
            B
          </button>
          <button
            className="style-button"
            onClick={() => onToggleStyle("fontStyle", "italic")}
            title="Cursiva"
          >
            I
          </button>
          <button
            className="style-button"
            onClick={() => onToggleStyle("underline", true)}
            title="Subrayado"
          >
            U
          </button>

          <input
            type="number"
            min={8}
            max={100}
            value={quoteFontSize}
            onChange={(e) => handleQuoteFontSizeChange(parseInt(e.target.value))}
            title="Tamaño de fuente"
          />

          <select
            value={quoteAlign}
            onChange={(e) => handleQuoteAlignChange(e.target.value)}
            title="Alineación"
            className="align-select"
          >
            <option value="left">Izq</option>
            <option value="center">Centro</option>
            <option value="right">Der</option>
          </select>

          <select
            value={quoteFont}
            onChange={(e) => handleQuoteFontChange(e.target.value)}
            title="Fuente"
            className="font-select"
          >
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans</option>
            <option value="monospace">Mono</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
      </section>

      <section className="section-container">
        <h3>Firma</h3>
        <textarea
          value={signature}
          onChange={(e) => onSignatureChange(e.target.value)}
          rows={2}
          placeholder="Autor de la cita..."
        />

        <div className="text-controls">
          <button
            className="style-button"
            onClick={() => onToggleStyle("fontWeight", "bold")}
            title="Negrita"
          >
            B
          </button>
          <button
            className="style-button"
            onClick={() => onToggleStyle("fontStyle", "italic")}
            title="Cursiva"
          >
            I
          </button>
          <button
            className="style-button"
            onClick={() => onToggleStyle("underline", true)}
            title="Subrayado"
          >
            U
          </button>

          <input
            type="number"
            min={8}
            max={100}
            value={signatureFontSize}
            onChange={(e) => handleSignatureFontSizeChange(parseInt(e.target.value))}
            title="Tamaño de fuente"
          />

          <select
            value={signatureAlign}
            onChange={(e) => handleSignatureAlignChange(e.target.value)}
            title="Alineación"
            className="align-select"
          >
            <option value="left">Izq</option>
            <option value="center">Centro</option>
            <option value="right">Der</option>
          </select>

          <select
            value={signatureFont}
            onChange={(e) => handleSignatureFontChange(e.target.value)}
            title="Fuente"
            className="font-select"
          >
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans</option>
            <option value="monospace">Mono</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
      </section>

      <section className="section-container">
        <h3>Formas</h3>
        <div className="shapes-grid">
          <button onClick={() => addShape("line")} className="shape-button">Línea</button>
          <button onClick={() => addShape("arrow")} className="shape-button">Flecha</button>
          <button onClick={() => addShape("rect")} className="shape-button">Rectángulo</button>
          <button onClick={() => addShape("circle")} className="shape-button">Círculo</button>
        </div>

        <div className="control-row shape-controls">
          <div className="control-item">
            <ColorPicker 
              color={strokeColor} 
              onChange={handleStrokeColorChange}
            />
          </div>

          <div className="stroke-width-control control-item">
            <input
              type="number"
              min={1}
              max={20}
              value={strokeWidth}
              onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdatedRightSidebar;