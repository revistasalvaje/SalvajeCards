import React, { useState, useContext, useEffect } from "react";
import { EditorContext } from "../App";
import { useNotification } from "../context/NotificationContext";

const LeftSidebar: React.FC = () => {
  const { canvasInstance } = useContext(EditorContext);
  const { showNotification } = useNotification();
  const [plantillas, setPlantillas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarPlantillas = async () => {
      try {
        // Simulamos la carga para este ejemplo
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar plantillas:", error);
        showNotification('Error al cargar plantillas', 'error');
      }
    };

    cargarPlantillas();
  }, [showNotification]);

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
      // Simulamos el guardado para este ejemplo
      setTimeout(() => {
        setNombre("");
        showNotification(`Plantilla "${nombre}" guardada correctamente`, 'success');
        setGuardando(false);
      }, 1000);
    } catch (error) {
      console.error("Error al guardar plantilla:", error);
      showNotification('Error al guardar la plantilla', 'error');
      setGuardando(false);
    }
  };

  return (
    <div className="sidebar left-sidebar">
      <div className="sidebar-content">
        <h2 className="section-title mb-2">Plantillas</h2>

        <div className="control-group">
          <input
            type="text"
            placeholder="Nombre de plantilla"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mb-2"
          />
          <button
            onClick={handleGuardar}
            disabled={guardando || !nombre.trim() || !canvasInstance.current}
            className="action-button primary mb-4"
          >
            {guardando ? (
              <>
                <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" className="opacity-25"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" className="opacity-75"></path>
                </svg>
                <span>Guardando...</span>
              </>
            ) : (
              'Guardar plantilla'
            )}
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center py-6">
            <svg className="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" className="opacity-25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" className="opacity-75"></path>
            </svg>
          </div>
        ) : plantillas.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M8 12h8"></path>
              <path d="M12 8v8"></path>
            </svg>
            <p className="empty-text">No hay plantillas guardadas</p>
            <p className="empty-subtext">Diseña y guarda tu primera plantilla</p>
          </div>
        ) : (
          <div className="templates-grid">
            {plantillas.map((plantilla) => (
              <div key={plantilla.id} className="template-item">
                <div className="template-image"></div>
                <div className="template-name">{plantilla.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;