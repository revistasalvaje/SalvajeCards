import React, { useState, useContext } from 'react';
import { EditorContext } from '../App';
import { useNotification } from '../context/NotificationContext';

interface TopBarProps {
  onChangeFormat: (format: 'square' | 'portrait') => void;
  currentFormat: 'square' | 'portrait';
}

const TopBar: React.FC<TopBarProps> = ({ onChangeFormat, currentFormat }) => {
  const { canvasInstance } = useContext(EditorContext);
  const { showNotification } = useNotification();
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    if (!canvasInstance.current) {
      showNotification('El editor no está listo', 'error');
      return;
    }

    setExporting(true);

    try {
      // Configuración para JPG
      const dataURL = canvasInstance.current.toDataURL({
        format: 'jpeg',
        quality: 0.9,
        multiplier: 2, // Doble resolución para mejor calidad
      });

      // Crear enlace para descarga
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `instagram-card-${currentFormat}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('Imagen exportada correctamente', 'success');
    } catch (error) {
      console.error('Error al exportar imagen:', error);
      showNotification('Error al exportar la imagen', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="top-bar">
      <div className="title-container">
        Editor de Cards
      </div>

      <div className="format-selector-container">
        <div className="format-selector">
          <button 
            className={currentFormat === 'square' ? 'active' : ''}
            onClick={() => onChangeFormat('square')}
          >
            Cuadrado
          </button>
          <button 
            className={currentFormat === 'portrait' ? 'active' : ''}
            onClick={() => onChangeFormat('portrait')}
          >
            Retrato
          </button>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="export-button"
      >
        {exporting ? (
          <>
            <div className="spinner"></div>
            Exportando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar JPG
          </>
        )}
      </button>
    </div>
  );
};

export default TopBar;