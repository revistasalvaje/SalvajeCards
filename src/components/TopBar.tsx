import React from "react";

interface TopBarProps {
  onChangeFormat: (format: 'square' | 'portrait') => void;
  currentFormat: 'square' | 'portrait';
  exporting?: boolean;
  onExport?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onChangeFormat, 
  currentFormat, 
  exporting = false,
  onExport
}) => {
  return (
    <div className="top-bar">
      <h1 className="top-bar-title">Editor de Tarjetas</h1>

      <div className="format-selector">
        <button 
          className={`format-button ${currentFormat === 'square' ? 'active' : ''}`}
          onClick={() => onChangeFormat('square')}
        >
          Cuadrado
        </button>
        <button 
          className={`format-button ${currentFormat === 'portrait' ? 'active' : ''}`}
          onClick={() => onChangeFormat('portrait')}
        >
          Retrato
        </button>
      </div>

      <button
        onClick={onExport}
        disabled={exporting}
        className="export-button"
      >
        {exporting ? (
          <>
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" className="opacity-25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" className="opacity-75"></path>
            </svg>
            Exportando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            Exportar JPG
          </>
        )}
      </button>
    </div>
  );
};

export default TopBar;