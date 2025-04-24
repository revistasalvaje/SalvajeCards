import React, { useEffect, useState } from 'react';
import ColorPicker from '../shared/ColorPicker';
import { useTemplateManager } from '../../hooks/useTemplateManager';

interface RightSidebarProps {
  uploadedBgImage: string | null;
  palette: string[];
  bgColor: string;
  textColor: string;
  quote: string;
  signature: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyImageBg: () => void;
  onPaletteClick: (color: string) => void;
  onBgColorChange: (hex: string) => void;
  onTextColorChange: (hex: string) => void;
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

const RightSidebar: React.FC<RightSidebarProps> = (props) => {
  // Template manager values
  const {
    currentBgColor,
    currentTextColor,
    currentQuoteFontSize,
    currentSignatureFontSize,
    currentQuoteFont,
    currentSignatureFont,
    currentQuoteAlign,
    currentSignatureAlign,
    currentQuoteText,
    currentSignatureText
  } = useTemplateManager();

  // Log values on render for debugging
  useEffect(() => {
    console.log("🎨 RightSidebar - Rendered with values:", {
      currentBgColor,
      currentTextColor,
      currentQuoteText,
      currentSignatureText
    });
  }, [currentBgColor, currentTextColor, currentQuoteText, currentSignatureText]);

  // Local state for UI controls
  const [fileName, setFileName] = useState<string>("");
  const [quoteFontSize, setQuoteFontSize] = useState(48);
  const [signatureFontSize, setSignatureFontSize] = useState(32);
  const [quoteFont, setQuoteFont] = useState("serif");
  const [signatureFont, setSignatureFont] = useState("serif");
  const [quoteAlign, setQuoteAlign] = useState("left");
  const [signatureAlign, setSignatureAlign] = useState("right");
  const [quoteText, setQuoteText] = useState("");
  const [signatureText, setSignatureText] = useState("");

  // Sync state with template manager for text
  useEffect(() => {
    if (currentQuoteText) {
      setQuoteText(currentQuoteText);
      props.onQuoteChange(currentQuoteText);
    }
  }, [currentQuoteText]);

  useEffect(() => {
    if (currentSignatureText) {
      setSignatureText(currentSignatureText);
      props.onSignatureChange(currentSignatureText);
    }
  }, [currentSignatureText]);

  // Sync state with template manager for font sizes
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

  // Sync state with template manager for fonts
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

  // Sync state with template manager for alignment
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

  // Sync props with local state for quote and signature
  useEffect(() => {
    if (props.quote && props.quote !== quoteText) {
      setQuoteText(props.quote);
    }
  }, [props.quote]);

  useEffect(() => {
    if (props.signature && props.signature !== signatureText) {
      setSignatureText(props.signature);
    }
  }, [props.signature]);

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    props.onImageUpload(e);
  };

  // Text controls handlers
  const handleQuoteFontSizeChange = (size: number) => {
    setQuoteFontSize(size);
    props.onFontSizeChange(size);
  };

  const handleSignatureFontSizeChange = (size: number) => {
    setSignatureFontSize(size);
    props.onFontSizeSignatureChange(size);
  };

  const handleQuoteFontChange = (font: string) => {
    setQuoteFont(font);
    props.onFontChange(font);
  };

  const handleSignatureFontChange = (font: string) => {
    setSignatureFont(font);
    props.onFontSignatureChange(font);
  };

  const handleQuoteAlignChange = (align: string) => {
    setQuoteAlign(align);
    props.onAlignChange(align);
  };

  const handleSignatureAlignChange = (align: string) => {
    setSignatureAlign(align);
    props.onAlignSignatureChange(align);
  };

  return (
    <div className="sidebar right-sidebar">
      {/* Background Section */}
      <section className="section-container">
        <div className="file-input-wrapper">
          <label className="file-input-label">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        <div className="control-row color-controls">
          <ColorPicker 
            color={currentBgColor || props.bgColor} 
            onChange={props.onBgColorChange}
          />

          <ColorPicker 
            color={currentTextColor || props.textColor} 
            onChange={props.onTextColorChange}
          />
        </div>

        {props.uploadedBgImage && (
          <>
            <div className="image-preview">
              <img src={props.uploadedBgImage} alt="Imagen cargada" />
            </div>

            <button
              onClick={props.onApplyImageBg}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Usar como fondo
            </button>
          </>
        )}

        {props.palette.length > 0 && (
          <div className="palette-container">
            <h3>Paleta de colores</h3>
            <div className="palette">
              {props.palette.map((color, idx) => (
                <div
                  key={idx}
                  className="palette-color"
                  style={{ backgroundColor: color }}
                  onClick={() => props.onPaletteClick(color)}
                  title={`Color ${idx + 1}`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500">
              Click: color de fondo | Doble click: color de texto
            </div>
          </div>
        )}
      </section>

      {/* Quote Section */}
      <section className="section-container">
        <h3>Cita</h3>
        <textarea
          value={quoteText || props.quote}
          onChange={(e) => {
            setQuoteText(e.target.value);
            props.onQuoteChange(e.target.value);
          }}
          rows={3}
          placeholder="Escribe tu cita aquí..."
        />

        <div className="text-controls">
          <button
            className="style-button"
            onClick={() => props.onToggleStyle("fontWeight", "bold")}
            title="Negrita"
          >
            B
          </button>
          <button
            className="style-button"
            onClick={() => props.onToggleStyle("fontStyle", "italic")}
            title="Cursiva"
          >
            I
          </button>
          <button
            className="style-button"
            onClick={() => props.onToggleStyle("underline", true)}
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

      {/* Signature Section */}
      <section className="section-container">
        <h3>Firma</h3>
        <textarea
          value={signatureText || props.signature}
          onChange={(e) => {
            setSignatureText(e.target.value);
            props.onSignatureChange(e.target.value);
          }}
          rows={2}
          placeholder="Autor de la cita..."
        />

        <div className="text-controls">
          <button
            className="style-button"
            onClick={() => props.onToggleStyle("fontWeight", "bold")}
            title="Negrita"
          >
            B
          </button>
          <button
            className="style-button"
            onClick={() => props.onToggleStyle("fontStyle", "italic")}
            title="Cursiva"
          >
            I
          </button>
          <button
            className="style-button"
            onClick={() => props.onToggleStyle("underline", true)}
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

      {/* Shapes Section */}
      <section className="section-container">
        <h3>Formas</h3>
        <div className="shapes-grid">
          <button onClick={() => props.addShape("line")} className="shape-button">Línea</button>
          <button onClick={() => props.addShape("arrow")} className="shape-button">Flecha</button>
          <button onClick={() => props.addShape("rect")} className="shape-button">Rectángulo</button>
          <button onClick={() => props.addShape("circle")} className="shape-button">Círculo</button>
        </div>

        <div className="control-row shape-controls">
          <div className="control-item">
            <ColorPicker 
              color={props.strokeColor} 
              onChange={props.handleStrokeColorChange}
            />
          </div>

          <div className="stroke-width-control control-item">
            <input
              type="number"
              min={1}
              max={20}
              value={props.strokeWidth}
              onChange={(e) => props.handleStrokeWidthChange(parseInt(e.target.value))}
              className="w-12 text-center"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default RightSidebar;