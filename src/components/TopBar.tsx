import React, { useContext, useState } from 'react';
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
        Instagram Cards Editor
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
        className="btn-primary"
      >
        {exporting ? (
          <>
            <svg className="loading-spinner" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exportando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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