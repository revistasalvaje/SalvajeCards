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
  // Actualización de la función cargarPlantilla para gestionar correctamente la escala al 50%
  // Esta función debe reemplazar a la implementación existente en src/hooks/useTemplateManager.ts

  const cargarPlantilla = async (id: string) => {
    try {
      if (!canvasInstance.current) {
        showNotification('El editor no está listo', 'error');
        return;
      }

      const plantilla = await cargarPlantillaIndexedDB(id);
      if (!plantilla) {
        showNotification('No se pudo cargar la plantilla', 'error');
        return;
      }

      const canvas = canvasInstance.current;
      canvas.clear();

      // Establecer fondo
      if (plantilla.bgType === "color") {
        canvas.setBackgroundColor(plantilla.bgValue, () => canvas.renderAll());
      } else if (plantilla.bgType === "image" && plantilla.bgValue) {
        fabric.Image.fromURL(plantilla.bgValue, (img) => {
          // Ajustar la imagen de fondo al tamaño del canvas
          img.scaleToWidth(canvas.getWidth() * 2); // Multiplicamos por 2 para compensar la escala de 0.5
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
      }

      // Añadir texto de cita
      if (plantilla.quote) {
        // Usar Textbox para permitir envolver texto
        const q = new fabric.Textbox(plantilla.quote.text, {
          left: plantilla.quote.left * 0.5, // Aplicar escala de 0.5
          top: plantilla.quote.top * 0.5, // Aplicar escala de 0.5
          fontSize: plantilla.quote.fontSize * 0.5, // Aplicar escala de 0.5
          fontFamily: plantilla.quote.fontFamily,
          textAlign: plantilla.quote.textAlign,
          name: "quote",
          width: (canvas.getWidth() - 100), // Ancho máximo ajustado
          breakWords: true, // Permitir romper palabras largas
        });
        canvas.add(q);
      }

      // Añadir firma
      if (plantilla.signature) {
        // Usar Textbox para permitir envolver texto
        const s = new fabric.Textbox(plantilla.signature.text, {
          left: plantilla.signature.left * 0.5, // Aplicar escala de 0.5
          top: plantilla.signature.top * 0.5, // Aplicar escala de 0.5
          fontSize: plantilla.signature.fontSize * 0.5, // Aplicar escala de 0.5
          fontFamily: plantilla.signature.fontFamily,
          textAlign: plantilla.signature.textAlign,
          name: "signature",
          width: 200 * 0.5, // Ancho máximo para firma con escala
          breakWords: true, // Permitir romper palabras largas
        });
        canvas.add(s);
      }

      // Añadir formas
      if (plantilla.shapes && plantilla.shapes.length > 0) {
        plantilla.shapes.forEach((shape) => {
          let obj;
          if (shape.type === "rect") {
            obj = new fabric.Rect({
              left: shape.left * 0.5, // Aplicar escala de 0.5
              top: shape.top * 0.5, // Aplicar escala de 0.5
              width: (shape.width || 120) * 0.5, // Aplicar escala de 0.5
              height: (shape.height || 80) * 0.5, // Aplicar escala de 0.5
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth * 0.5, // Aplicar escala de 0.5 al grosor del trazo
              fill: "transparent",
            });
          } else if (shape.type === "circle") {
            obj = new fabric.Circle({
              left: shape.left * 0.5, // Aplicar escala de 0.5
              top: shape.top * 0.5, // Aplicar escala de 0.5
              radius: (shape.radius || 50) * 0.5, // Aplicar escala de 0.5
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth * 0.5, // Aplicar escala de 0.5 al grosor del trazo
              fill: "transparent",
            });
          } else if (shape.type === "line") {
            // Para líneas, debemos calcular las coordenadas de inicio y fin
            obj = new fabric.Line(
              [
                shape.left * 0.5, 
                shape.top * 0.5, 
                (shape.left + 150) * 0.5, 
                shape.top * 0.5
              ], 
              {
                stroke: shape.stroke,
                strokeWidth: shape.strokeWidth * 0.5, // Aplicar escala de 0.5 al grosor del trazo
              }
            );
          } else if (shape.type === "group") {
            // Para el caso de flechas (grupos compuestos por línea y triángulo)
            // Tratar de recrear la flecha con la escala correcta
            const line = new fabric.Line([0, 0, 150 * 0.5, 0], {
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth * 0.5,
              left: 0,
              top: -(shape.strokeWidth * 0.5) / 2,
            });

            const triangle = new fabric.Triangle({
              left: 150 * 0.5,
              top: 0,
              width: 12 * 0.5,
              height: 12 * 0.5,
              angle: 90,
              originX: "center",
              originY: "center",
              fill: shape.stroke,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth * 0.5,
              selectable: false,
            });

            obj = new fabric.Group([line, triangle], {
              left: shape.left * 0.5,
              top: shape.top * 0.5,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth * 0.5,
              fill: "transparent",
            });
          }

          if (obj) canvas.add(obj);
        });
      }

      canvas.renderAll();
      showNotification(`Plantilla "${plantilla.name}" cargada correctamente`, 'success');
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