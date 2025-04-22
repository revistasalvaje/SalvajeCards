import React, { useContext, useState } from 'react';
import { EditorContext } from '../App';
import { useNotification } from '../context/NotificationContext';

interface ExportButtonProps {
  exportFormat?: 'jpg' | 'png';
  filename?: string;
  quality?: number;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  exportFormat = 'jpg',
  filename = 'card-export',
  quality = 1.0
}) => {
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
      // Configurar opciones de exportación
      const format = exportFormat === 'jpg' ? 'jpeg' : 'png';
      const mimeType = `image/${format}`;
      const extension = exportFormat;
      const fullFilename = `${filename}.${extension}`;

      // Obtener la imagen como dataURL
      const dataURL = canvasInstance.current.toDataURL({
        format,
        quality,
        multiplier: 2, // Doble resolución para mejor calidad
      });

      // Crear enlace para descarga
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = fullFilename;
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
    <button
      onClick={handleExport}
      disabled={exporting || !canvasInstance.current}
      className={`flex items-center justify-center px-4 py-2 ${
        exporting ? 'bg-gray-400' : 'bg-blue-600'
      } text-white rounded-md hover:bg-blue-700 transition-colors w-full`}
    >
      {exporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exportando...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar JPG
        </>
      )}
    </button>
  );
};

export default ExportButton;