import React from 'react';
import { Accordion, AccordionItem } from './Accordion';
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
      <h2>Controles</h2>

      <Accordion>
        <AccordionItem title="Fondo" defaultOpen={true}>
          <div className="control-group">
            <div className="control-row">
              <ColorPicker 
                color={bgColor} 
                onChange={onBgColorChange} 
                label="Color de fondo" 
              />

              <ColorPicker 
                color={textColor} 
                onChange={onTextColorChange} 
                label="Color de texto" 
              />
            </div>

            <div className="control-group">
              <label>Imagen de fondo</label>
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
            </div>

            {palette.length > 0 && (
              <div className="control-group">
                <label>Paleta extraída</label>
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
                <div className="text-xs text-gray-500">
                  Click para aplicar al fondo / Doble click para texto
                </div>
              </div>
            )}
          </div>
        </AccordionItem>

        <AccordionItem title="Texto" defaultOpen={true}>
          <div className="control-group">
            <label>Cita</label>
            <textarea
              value={quote}
              onChange={(e) => onQuoteChange(e.target.value)}
              rows={3}
              placeholder="Escribe tu cita aquí..."
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
                min={8}
                max={100}
                defaultValue={48}
                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                title="Tamaño de fuente"
              />

              <select
                onChange={(e) => onAlignChange(e.target.value)}
                title="Alineación"
              >
                <option value="left">Izq</option>
                <option value="center">Centro</option>
                <option value="right">Der</option>
              </select>
            </div>

            <div className="control-row">
              <select
                style={{ width: '100%' }}
                onChange={(e) => onFontChange(e.target.value)}
                title="Fuente"
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>

          <div className="control-group">
            <label>Firma</label>
            <textarea
              value={signature}
              onChange={(e) => onSignatureChange(e.target.value)}
              rows={2}
              placeholder="Autor de la cita..."
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
                max={100}
                defaultValue={32}
                onChange={(e) => onFontSizeSignatureChange(parseInt(e.target.value))}
                title="Tamaño de fuente"
              />

              <select
                onChange={(e) => onAlignSignatureChange(e.target.value)}
                defaultValue="right"
                title="Alineación"
              >
                <option value="left">Izq</option>
                <option value="center">Centro</option>
                <option value="right">Der</option>
              </select>
            </div>

            <div className="control-row">
              <select
                style={{ width: '100%' }}
                onChange={(e) => onFontSignatureChange(e.target.value)}
                title="Fuente"
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="Formas" defaultOpen={true}>
          <div className="control-group">
            <label>Insertar forma</label>
            <div className="control-row" style={{ flexWrap: 'wrap' }}>
              <button 
                onClick={() => addShape("line")} 
                className="btn btn-secondary"
                style={{ flex: '1 0 45%' }}
              >
                Línea
              </button>
              <button 
                onClick={() => addShape("arrow")} 
                className="btn btn-secondary"
                style={{ flex: '1 0 45%' }}
              >
                Flecha
              </button>
              <button 
                onClick={() => addShape("rect")} 
                className="btn btn-secondary"
                style={{ flex: '1 0 45%' }}
              >
                Rectángulo
              </button>
              <button 
                onClick={() => addShape("circle")} 
                className="btn btn-secondary"
                style={{ flex: '1 0 45%' }}
              >
                Círculo
              </button>
            </div>

            <div className="control-row" style={{ marginTop: '12px' }}>
              <div>
                <label>Color</label>
                <ColorPicker 
                  color={strokeColor} 
                  onChange={handleStrokeColorChange}
                />
              </div>

              <div>
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
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default UpdatedRightSidebar;