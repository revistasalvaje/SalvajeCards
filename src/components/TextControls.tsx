import React, { useState, useEffect } from "react";

interface TextControlsProps {
  label: string;
  text: string;
  onChange: (text: string) => void;
  onToggleStyle: (style: string, value: any) => void;
  onFontSizeChange: (size: number) => void;
  onFontChange: (font: string) => void;
  onAlignChange: (align: string) => void;
}

const TextControls: React.FC<TextControlsProps> = ({
  label,
  text,
  onChange,
  onToggleStyle,
  onFontSizeChange,
  onFontChange,
  onAlignChange,
}) => {
  const [fontSize, setFontSize] = useState(label === "Cita" ? 48 : 32);
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    linethrough: false
  });

  // Toggle style function
  const toggleStyle = (style: string) => {
    const newStyleState = !activeStyles[style as keyof typeof activeStyles];

    let styleKey = style;
    let styleValue: any = newStyleState ? true : false;

    if (style === "bold") {
      styleKey = "fontWeight";
      styleValue = newStyleState ? "bold" : "normal";
    } else if (style === "italic") {
      styleKey = "fontStyle";
      styleValue = newStyleState ? "italic" : "normal";
    } else if (style === "underline" || style === "linethrough") {
      styleValue = newStyleState;
    }

    // Toggle the style state
    setActiveStyles(prev => ({
      ...prev,
      [style]: newStyleState
    }));

    // Apply the style to the canvas
    onToggleStyle(styleKey, styleValue);
  };

  return (
    <div className="text-control-panel">
      <label className="heading-3">{label}</label>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className="input mb-2"
        rows={label === "Cita" ? 3 : 2}
        placeholder={`Escribir ${label.toLowerCase()}...`}
      />

      <div className="flex flex-wrap gap-1 items-center mb-2">
        {/* Style buttons */}
        {["bold", "italic", "underline", "linethrough"].map((style) => (
          <button
            key={style}
            className={`btn btn-icon btn-secondary ${
              activeStyles[style as keyof typeof activeStyles] ? 'text-primary border-primary' : ''
            }`}
            onClick={() => toggleStyle(style)}
            title={style.charAt(0).toUpperCase() + style.slice(1)}
          >
            {style[0].toUpperCase()}
          </button>
        ))}

        {/* Font size */}
        <div className="flex items-center ml-1">
          <input
            type="number"
            min={8}
            max={100}
            value={fontSize}
            className="input w-14 text-center"
            onChange={(e) => {
              const size = parseInt(e.target.value);
              setFontSize(size);
              onFontSizeChange(size);
            }}
          />
        </div>

        {/* Font family */}
        <select
          className="input ml-1"
          onChange={(e) => onFontChange(e.target.value)}
        >
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans</option>
          <option value="monospace">Mono</option>
        </select>

        {/* Text alignment */}
        <div className="flex ml-1">
          <button 
            className="btn btn-icon btn-secondary" 
            onClick={() => onAlignChange("left")}
            title="Alinear a la izquierda"
          >
            ←
          </button>
          <button 
            className="btn btn-icon btn-secondary" 
            onClick={() => onAlignChange("center")}
            title="Centrar"
          >
            ↔
          </button>
          <button 
            className="btn btn-icon btn-secondary" 
            onClick={() => onAlignChange("right")}
            title="Alinear a la derecha"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextControls;