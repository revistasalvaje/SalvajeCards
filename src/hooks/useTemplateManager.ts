import { useState, useEffect, useContext } from 'react';
import { EditorContext } from '../App';
import {
  guardarPlantillaIndexedDB,
  loadAllPlantillasIndexedDB,
  cargarPlantillaIndexedDB,
  Plantilla
} from '../utils/templateManager';
import { useTemplate } from '../context/TemplateContext';
import { renderTemplate } from '../utils/templateRenderer';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  message: string;
  type: NotificationType;
  id: number;
}

export function useTemplateManager() {
  // Usar el contexto compartido para los valores de plantilla
  const { values, updateValues } = useTemplate();

  const { canvasInstance, quoteTextRef, signatureTextRef } = useContext(EditorContext);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Cargar plantillas al inicio
  useEffect(() => {
    loadPlantillas();
  }, []);

  const loadPlantillas = async () => {
    setLoading(true);
    try {
      const data = await loadAllPlantillasIndexedDB();
      setPlantillas(data);
      if (data.length > 0) {
        showNotification('Plantillas cargadas correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
      showNotification('Error al cargar plantillas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const guardarPlantilla = async (nombre: string) => {
    if (!canvasInstance.current) {
      showNotification('El editor no está listo', 'error');
      return false;
    }

    if (!nombre.trim()) {
      showNotification('Ingresa un nombre para la plantilla', 'warning');
      return false;
    }

    setSaving(true);
    try {
      await guardarPlantillaIndexedDB(canvasInstance.current, nombre);
      await loadPlantillas();
      showNotification(`Plantilla "${nombre}" guardada`, 'success');
      return true;
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
      showNotification('Error al guardar la plantilla', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const cargarPlantilla = async (id: string) => {
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

      // Usar el renderizador de plantillas mejorado
      const templateData = await renderTemplate(
        canvas,
        plantilla,
        quoteTextRef,
        signatureTextRef
      );

      // Actualizar todos los valores de estado en el contexto compartido
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

      // Registrar los valores de estado actualizados
      console.log("🎨 Estados actualizados:", {
        bgColor: templateData.bgColor,
        textColor: templateData.textColor,
        quoteFontSize: templateData.quoteFontSize,
        signatureFontSize: templateData.signatureFontSize,
        quoteText: templateData.quoteText,
        signatureText: templateData.signatureText
      });

      showNotification(`Plantilla "${plantilla.name}" cargada correctamente`, 'success');
    } catch (error) {
      console.error('Error al cargar la plantilla:', error);
      showNotification('Error al cargar la plantilla', 'error');
    }
  };

  const showNotification = (message: string, type: NotificationType = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { message, type, id }]);

    setTimeout(() => {
      setNotifications(notifications => notifications.filter(n => n.id !== id));
    }, 3000);
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications => notifications.filter(n => n.id !== id));
  };

  const isCanvasReady = () => {
    return canvasInstance.current !== null;
  };

  return {
    plantillas,
    loading,
    saving,
    notifications,
    guardarPlantilla,
    cargarPlantilla,
    dismissNotification,
    isCanvasReady,
    // Ahora devolvemos los valores del contexto compartido
    ...values
  };
}