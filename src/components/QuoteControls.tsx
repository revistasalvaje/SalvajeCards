import React, { useState } from "react";

interface QuoteControlsProps {
  quote: string;
  onQuoteChange: (text: string) => void;
  onToggleStyle: (style: string, value: any) => void;
  onFontSizeChange: (size: number) => void;
  onFontChange: (font: string) => void;
  onAlignChange: (align: string) => void;
}

const QuoteControls: React.FC<QuoteControlsProps> = ({
  quote,
  onQuoteChange,
  onToggleStyle,
  onFontSizeChange,
  onFontChange,
  onAlignChange,
}) => {
  // Track active styles
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    linethrough: false
  });

  // Font size state
  const [fontSize, setFontSize] = useState(48); // Default font size

  // Toggle style function
  const toggleStyle = (style: string) => {
    let styleKey = style;
    let styleValue: any = true;

    if (style === "bold") {
      styleKey = "fontWeight";
      styleValue = "bold";
    } else if (style === "italic") {
      styleKey = "fontStyle";
      styleValue = "italic";
    }

    // Toggle the style state
    setActiveStyles(prev => ({
      ...prev,
      [style]: !prev[style as keyof typeof prev]
    }));

    // Apply the style to the canvas
    onToggleStyle(styleKey, styleValue);
  };

  return (
    <div className="mb-6 w-full">
      <h3 className="text-sm font-semibold mb-2">Cita</h3>
      <div className="mb-3">
        <textarea
          value={quote}
          onChange={(e) => onQuoteChange(e.target.value)}
          className="w-full p-2 text-sm mb-3 resize-none"
          rows={3}
          placeholder="Ingresa un texto inspirador..."
        />
      </div>

      <div className="text-controls">
        {["bold", "italic", "underline", "linethrough"].map((style) => (
          <button
            key={style}
            className={`text-control-btn ${activeStyles[style as keyof typeof activeStyles] ? 'active' : ''}`}
            onClick={() => toggleStyle(style)}
            title={style.charAt(0).toUpperCase() + style.slice(1)}
          >
            {style[0].toUpperCase()}
          </button>
        ))}

        <input
          type="number"
          min={8}
          max={100}
          value={fontSize}
          className="w-14 px-2 py-1 border text-center text-xs mx-1"
          onChange={(e) => {
            const size = parseInt(e.target.value);
            setFontSize(size);
            onFontSizeChange(size);
          }}
        />

        <select
          className="px-2 py-1 border text-xs"
          onChange={(e) => onFontChange(e.target.value)}
        >
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans</option>
          <option value="monospace">Mono</option>
        </select>

        <select
          className="px-2 py-1 border text-xs ml-1"
          onChange={(e) => onAlignChange(e.target.value)}
        >
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
      </div>
    </div>
  );
};

export default QuoteControls;