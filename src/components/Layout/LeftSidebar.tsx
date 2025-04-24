import React, { useContext, useState } from "react";
import {
  guardarPlantillaIndexedDB,
  loadAllPlantillasIndexedDB,
  cargarPlantillaIndexedDB,
  Plantilla,
} from "../../utils/templateManager";
import { EditorContext } from "../../App";
import { useNotification } from "../../context/NotificationContext";
import { useTemplate } from "../../context/TemplateContext";
import { renderTemplate } from "../../utils/templateRenderer";

const LeftSidebar: React.FC = () => {
  const { canvasInstance, quoteTextRef, signatureTextRef } = useContext(EditorContext);
  const { showNotification } = useNotification();
  const { values, updateValues } = useTemplate(); // Usar el contexto de plantilla

  const [nombre, setNombre] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);

  // Cargar plantillas al inicio
  React.useEffect(() => {
    const cargarPlantillas = async () => {
      try {
        const data = await loadAllPlantillasIndexedDB();
        console.log("Plantillas obtenidas al cargar:", data);
        setPlantillas(data);
      } catch (error) {
        console.error("Error al cargar plantillas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPlantillas();
  }, []);

  const handleGuardar = async () => {
    if (!canvasInstance.current) {
      showNotification('El editor no está listo', 'error');
      return;
    }

    if (!nombre.trim()) {
      showNotification('Por favor ingresa un nombre para la plantilla', 'warning');
      return;
    }

    try {
      setGuardando(true);
      await guardarPlantillaIndexedDB(canvasInstance.current, nombre);
      setNombre("");
      showNotification(`Plantilla "${nombre}" guardada correctamente`, 'success');

      // Recarga las plantillas
      const nuevas = await loadAllPlantillasIndexedDB();
      setPlantillas(nuevas);
    } catch (error) {
      console.error("Error al guardar plantilla:", error);
      showNotification('Error al guardar la plantilla', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const handleCargar = async (id: string) => {
    try {
      if (!canvasInstance.current) {
        showNotification('El editor no está listo', 'error');
        return;
      }

      console.log("🚀 Iniciando carga de plantilla con ID:", id);

      const plantilla = await cargarPlantillaIndexedDB(id);
      if (!plantilla) {
        showNotification('No se pudo cargar la plantilla', 'error');
        return;
      }

      console.log("📄 Datos de la plantilla cargada:", JSON.stringify(plantilla, null, 2));

      const canvas = canvasInstance.current;

      // Usar el renderizador de plantillas y obtener los datos
      const templateData = await renderTemplate(
        canvas,
        plantilla,
        quoteTextRef,
        signatureTextRef
      );

      // Actualizar todos los valores en el contexto compartido
      updateValues({
        currentBgColor: templateData.bgColor,
        currentTextColor: templateData.textColor,
        currentQuoteFontSize: templateData.quoteFontSize,
        currentSignatureFontSize: templateData.signatureFontSize,
        currentQuoteFont: templateData.quoteFont,
        currentSignatureFont: templateData.signatureFont,
        currentQuoteAlign: templateData.quoteAlign,
        currentSignatureAlign: templateData.signatureAlign,
        currentQuoteText: templateData.quoteText,
        currentSignatureText: templateData.signatureText
      });

      // Registrar actualizaciones
      console.log("🎨 Valores actualizados en el contexto:", {
        bgColor: templateData.bgColor,
        textColor: templateData.textColor,
        quoteFontSize: templateData.quoteFontSize,
        signatureFontSize: templateData.signatureFontSize,
        quoteText: templateData.quoteText,
        signatureText: templateData.signatureText
      });

      showNotification(`Plantilla "${plantilla.name}" cargada correctamente`, 'success');
    } catch (error) {
      console.error("Error al cargar la plantilla:", error);
      showNotification('Error al cargar la plantilla', 'error');
    }
  };

  const isCanvasReady = () => {
    return canvasInstance.current !== null;
  };

  return (
    <div className="sidebar">
      <h2>Plantillas</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre plantilla"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full"
        />
        <button
          onClick={handleGuardar}
          disabled={guardando || !nombre.trim() || !isCanvasReady()}
          className={`w-full btn-primary ${(guardando || !nombre.trim() || !isCanvasReady()) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {guardando ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
          ) : !isCanvasReady() ? "Esperando editor..." : "Guardar plantilla"}
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        {cargando ? (
          <div className="flex justify-center items-center h-24">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : plantillas.length === 0 ? (
        <div className="text-center py-6 text-secondary">
          <p>No hay plantillas guardadas</p>
          <p className="text-xs mt-1">Diseña y guarda tu primera plantilla</p>
        </div>
        ) : (
          <div className="templates-grid">
            {plantillas.map((p) => (
              <div key={p.id} className="template-item" onClick={() => handleCargar(p.id)}>
                <img
                  src={p.thumbnail}
                  className="template-thumbnail"
                  alt={p.name}
                />
                <div className="template-name">{p.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;