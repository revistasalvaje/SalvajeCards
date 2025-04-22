// src/hooks/useTemplateManager.ts
import { useState, useEffect, useContext } from 'react';
import { EditorContext } from '../App';
import {
  guardarPlantillaIndexedDB,
  loadAllPlantillasIndexedDB,
  cargarPlantillaIndexedDB,
  Plantilla
} from '../utils/templateManager';
import { fabric } from 'fabric';

// Tipos de notificación para feedback visual
type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  message: string;
  type: NotificationType;
  id: number;
}

export function useTemplateManager() {
  const { canvasInstance } = useContext(EditorContext);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Cargar plantillas al inicio
  useEffect(() => {
    loadPlantillas();
  }, []);

  // Cargar todas las plantillas
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

  // Guardar una nueva plantilla
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
      await loadPlantillas(); // Recargar plantillas
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

  // Cargar una plantilla existente
  const cargarPlantilla = async (id: string) => {
    if (!canvasInstance.current) {
      showNotification('El editor no está listo', 'error');
      return;
    }

    try {
      const plantilla = await cargarPlantillaIndexedDB(id);
      if (!plantilla) {
        showNotification('No se encontró la plantilla', 'error');
        return;
      }

      const canvas = canvasInstance.current;
      canvas.clear();

      // Establecer fondo
      if (plantilla.bgType === "color") {
        canvas.setBackgroundColor(plantilla.bgValue, () => canvas.renderAll());
      } else if (plantilla.bgType === "image" && plantilla.bgValue) {
        fabric.Image.fromURL(plantilla.bgValue, (img) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
      }

      // Añadir texto de cita
      if (plantilla.quote) {
        const q = new fabric.Textbox(plantilla.quote.text, {
          left: plantilla.quote.left,
          top: plantilla.quote.top,
          fontSize: plantilla.quote.fontSize,
          fontFamily: plantilla.quote.fontFamily,
          textAlign: plantilla.quote.textAlign,
          name: "quote",
        });
        canvas.add(q);
      }

      // Añadir firma
      if (plantilla.signature) {
        const s = new fabric.Textbox(plantilla.signature.text, {
          left: plantilla.signature.left,
          top: plantilla.signature.top,
          fontSize: plantilla.signature.fontSize,
          fontFamily: plantilla.signature.fontFamily,
          textAlign: plantilla.signature.textAlign,
          name: "signature",
        });
        canvas.add(s);
      }

      // Añadir formas
      if (plantilla.shapes && plantilla.shapes.length > 0) {
        plantilla.shapes.forEach((shape) => {
          let obj;
          if (shape.type === "rect") {
            obj = new fabric.Rect({
              left: shape.left,
              top: shape.top,
              width: 120,
              height: 80,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth,
              fill: "transparent",
            });
          } else if (shape.type === "circle") {
            obj = new fabric.Circle({
              left: shape.left,
              top: shape.top,
              radius: 50,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth,
              fill: "transparent",
            });
          } else if (shape.type === "line") {
            obj = new fabric.Line([shape.left, shape.top, shape.left + 150, shape.top], {
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth,
            });
          }
          if (obj) canvas.add(obj);
        });
      }

      canvas.renderAll();
      showNotification(`Plantilla "${plantilla.name}" cargada`, 'success');
    } catch (error) {
      console.error('Error al cargar la plantilla:', error);
      showNotification('Error al cargar la plantilla', 'error');
    }
  };

  // Sistema de notificaciones
  const showNotification = (message: string, type: NotificationType = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { message, type, id }]);

    // Auto-eliminar después de 3 segundos
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
    isCanvasReady
  };
}