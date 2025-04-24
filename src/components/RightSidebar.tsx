import React, { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";
import ColorPickers from "./ColorPickers"; // Importar el componente actualizado

// Componente de Accordion simplificado
const AccordionSection = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="control-group">
      <button 
        className="accordion-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {title}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="accordion-icon"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

// Componente principal de la barra lateral derecha
const RightSidebar = ({
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
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    onImageUpload(e);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <AccordionSection title="Fondo" defaultOpen={true}>
          {/* Color picker mejorado usando el componente actualizado */}
          <ColorPickers
            bgColor={bgColor}
            textColor={textColor}
            showBgPicker={showBgPicker}
            showTextPicker={showTextPicker}
            toggleBgPicker={toggleBgPicker}
            toggleTextPicker={toggleTextPicker}
            onBgColorChange={onBgColorChange}
            onTextColorChange={onTextColorChange}
          />

          {/* Imagen de fondo */}
          <div className="control-group">
            <h3 className="section-title">Imagen de fondo</h3>
            <div className="file-input-wrapper">
              <label className="file-input-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                Seleccionar imagen
                <input
                  type="file"
                  className="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              {fileName && <div className="file-name">{fileName}</div>}
            </div>

            {uploadedBgImage && (
              <>
                <div className="image-preview">
                  <img src={uploadedBgImage} alt="Vista previa" />
                </div>
                <button 
                  className="action-button primary"
                  onClick={onApplyImageBg}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  Aplicar como fondo
                </button>
              </>
            )}
          </div>

          {/* Paleta de colores */}
          {palette.length > 0 && (
            <div className="control-group">
              <h3 className="section-title">Paleta extraída</h3>
              <div className="palette">
                {palette.map((color, i) => (
                  <div
                    key={i}
                    className="palette-color"
                    style={{ backgroundColor: color }}
                    onClick={() => onPaletteClick(color)}
                  />
                ))}
              </div>
              <p className="info-text">Click: color de fondo | Doble click: color de texto</p>
            </div>
          )}
        </AccordionSection>

        <AccordionSection title="Texto" defaultOpen={true}>
          {/* Cita */}
          <div className="control-group">
            <h3 className="section-title">Cita</h3>
            <textarea
              value={quote}
              onChange={(e) => onQuoteChange(e.target.value)}
              placeholder="Escribe la cita..."
              className="mb-2"
            />

            <div className="control-row">
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
                min={12}
                max={72}
                defaultValue={48}
                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                title="Tamaño de fuente"
              />
            </div>

            <div className="control-row">
              <select
                onChange={(e) => onFontChange(e.target.value)}
                defaultValue="serif"
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
              </select>

              <select
                onChange={(e) => onAlignChange(e.target.value)}
                defaultValue="left"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>

          {/* Firma */}
          <div className="control-group">
            <h3 className="section-title">Firma</h3>
            <textarea
              value={signature}
              onChange={(e) => onSignatureChange(e.target.value)}
              rows={1}
              placeholder="Autor de la cita..."
              className="mb-2"
            />

            <div className="control-row">
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

              <input
                type="number"
                min={8}
                max={48}
                defaultValue={32}
                onChange={(e) => onFontSizeSignatureChange(parseInt(e.target.value))}
                title="Tamaño de fuente"
              />
            </div>

            <div className="control-row">
              <select
                onChange={(e) => onFontSignatureChange(e.target.value)}
                defaultValue="serif"
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
              </select>

              <select
                onChange={(e) => onAlignSignatureChange(e.target.value)}
                defaultValue="right"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Formas" defaultOpen={true}>
          <div className="control-group">
            <h3 className="section-title">Añadir formas</h3>
            <div className="shapes-grid">
              <button
                className="action-button"
                onClick={() => addShape("line")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Línea
              </button>

              <button
                className="action-button"
                onClick={() => addShape("arrow")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                Flecha
              </button>

              <button
                className="action-button"
                onClick={() => addShape("rect")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
                Rectángulo
              </button>

              <button
                className="action-button"
                onClick={() => addShape("circle")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Círculo
              </button>
            </div>
          </div>

          <div className="control-group">
            <h3 className="section-title">Estilo de trazo</h3>
            <div className="control-row">
              <div className="relative">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => handleStrokeColorChange(e.target.value)}
                  className="color-swatch"
                />
              </div>

              <div>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={strokeWidth}
                  onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
                  title="Grosor de trazo"
                />
              </div>
            </div>
          </div>

          <div className="control-group">
            <p className="info-text">Consejo: Selecciona una forma para editar su estilo o elimínala con la tecla Delete</p>
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

export default RightSidebar;