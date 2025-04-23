import React from "react";

interface SignatureControlsProps {
  signature: string;
  onChange: (text: string) => void;
  onToggleStyle: (style: string, value: any) => void;
  onFontSizeChange: (size: number) => void;
  onFontChange: (font: string) => void;
  onAlignChange: (align: string) => void;
}

const SignatureControls: React.FC<SignatureControlsProps> = ({
  signature,
  onChange,
  onToggleStyle,
  onFontSizeChange,
  onFontChange,
  onAlignChange,
}) => {
  return (
    <div className="control-group">
      <h3>Firma</h3>

      <textarea
        value={signature}
        onChange={(e) => onChange(e.target.value)}
        className="mb-3"
        rows={2}
        placeholder="Autor de la cita..."
      />

      <div className="controls-row">
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
        <button
          className="style-button"
          onClick={() => onToggleStyle("linethrough", true)}
          title="Tachado"
        >
          S
        </button>

        <input
          type="number"
          min={8}
          max={100}
          defaultValue={32}
          className="w-12 text-center"
          onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
          title="Tamaño de fuente"
        />
      </div>

      <div className="controls-row">
        <select
          className="flex-1"
          onChange={(e) => onFontChange(e.target.value)}
          title="Tipo de fuente"
        >
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans Serif</option>
          <option value="monospace">Monospace</option>
        </select>

        <select
          className="flex-1"
          onChange={(e) => onAlignChange(e.target.value)}
          defaultValue="right"
          title="Alineación"
        >
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
      </div>
    </div>
  );
};

export default SignatureControls;