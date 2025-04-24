import React from 'react';
import ColorPicker from './ColorPicker';

interface RightSidebarProps {
  uploadedBgImage: string | null;
  palette: string[];
  bgColor: string;
  textColor: string;
  quote: string;
  signature: string;
  strokeColor: string;
  strokeWidth: number;
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
}

const UpdatedRightSidebar: React.FC<RightSidebarProps> = ({
  uploadedBgImage,
  palette,
  bgColor,
  textColor,
  quote,
  signature,
  strokeColor,
  strokeWidth,
  onImageUpload,
  onApplyImageBg,
  onPaletteClick,
  onBgColorChange,
  onTextColorChange,
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
  const [fileName, setFileName] = React.useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    onImageUpload(e);
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
            color={bgColor} 
            onChange={onBgColorChange} 
            label="Fondo" 
          />

          <ColorPicker 
            color={textColor} 
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
            defaultValue={48}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
            title="Tamaño de fuente"
          />

          <select
            onChange={(e) => onAlignChange(e.target.value)}
            title="Alineación"
            className="align-select"
          >
            <option value="left">Izq</option>
            <option value="center">Centro</option>
            <option value="right">Der</option>
          </select>

          <select
            onChange={(e) => onFontChange(e.target.value)}
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
            defaultValue={32}
            onChange={(e) => onFontSizeSignatureChange(parseInt(e.target.value))}
            title="Tamaño de fuente"
          />

          <select
            onChange={(e) => onAlignSignatureChange(e.target.value)}
            defaultValue="right"
            title="Alineación"
            className="align-select"
          >
            <option value="left">Izq</option>
            <option value="center">Centro</option>
            <option value="right">Der</option>
          </select>

          <select
            onChange={(e) => onFontSignatureChange(e.target.value)}
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