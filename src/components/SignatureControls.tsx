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
    <div className="mb-4 w-full max-w-full">
      <h3 className="text-sm font-semibold mb-2">Firma</h3>
      <div className="mb-2">
        <div className="mb-2">
          <div className="w-full overflow-hidden">
            <div className="max-w-full">
              <textarea
                value={signature}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full max-w-full p-2 border rounded text-sm mb-2 resize-none"
                rows={2}
                placeholder="Autor de la cita..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controles rediseñados para ocupar menos espacio */}
      <div className="flex flex-wrap items-center gap-1 text-xs w-full">
        {["bold", "italic", "underline", "linethrough"].map((style) => (
          <button
            key={style}
            className="w-6 h-6 border rounded shrink-0 text-xs"
            onClick={() =>
              onToggleStyle(
                style === "bold"
                  ? "fontWeight"
                  : style === "italic"
                  ? "fontStyle"
                  : style,
                style === "bold"
                  ? "bold"
                  : style === "italic"
                  ? "italic"
                  : true
              )
            }
          >
            {style[0].toUpperCase()}
          </button>
        ))}

        <input
          type="number"
          min={8}
          max={100}
          defaultValue={32} // Valor predeterminado para el tamaño del texto de firma
          className="w-9 px-1 py-0.5 border rounded text-center shrink-0 text-xs"
          onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
        />

        <select
          className="w-14 px-1 py-0.5 border rounded shrink-0 text-xs"
          onChange={(e) => onFontChange(e.target.value)}
        >
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans</option>
          <option value="monospace">Mono</option>
        </select>

        <select
          className="w-16 px-1 py-0.5 border rounded shrink-0 text-xs"
          onChange={(e) => onAlignChange(e.target.value)}
          defaultValue="right"
        >
          <option value="left">Izq</option>
          <option value="center">Centro</option>
          <option value="right">Der</option>
        </select>
      </div>
    </div>
  );
};

export default SignatureControls;