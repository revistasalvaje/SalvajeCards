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
  const { canvasInstance, quoteTextRef, signatureTextRef } = useContext(EditorContext);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Estados para controlar la configuración actual
  const [currentBgColor, setCurrentBgColor] = useState("#ffffff");
  const [currentTextColor, setCurrentTextColor] = useState("#000000");
  const [currentQuoteFontSize, setCurrentQuoteFontSize] = useState(48);
  const [currentSignatureFontSize, setCurrentSignatureFontSize] = useState(32);
  const [currentQuoteFont, setCurrentQuoteFont] = useState("serif");
  const [currentSignatureFont, setCurrentSignatureFont] = useState("serif");
  const [currentQuoteAlign, setCurrentQuoteAlign] = useState("left");
  const [currentSignatureAlign, setCurrentSignatureAlign] = useState("right");

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

  // Cargar una plantilla existente con sincronización de controles UI
  const cargarPlantilla = async (id: string) => {
    try {
      if (!canvasInstance.current) {
        showNotification('El editor no está listo', 'error');
        return;
      }

      // Añadir debugger
      console.log("🚀 Iniciando carga de plantilla con ID:", id);

      const plantilla = await cargarPlantillaIndexedDB(id);
      if (!plantilla) {
        showNotification('No se pudo cargar la plantilla', 'error');
        return;
      }

      console.log("📄 Datos de la plantilla cargada:", JSON.stringify(plantilla, null, 2));
      console.log("👉 Quote:", plantilla.quote);
      console.log("👉 Signature:", plantilla.signature);

      const canvas = canvasInstance.current;

      // Mantener los campos de texto pero eliminar otros objetos
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        if (obj !== quoteTextRef?.current && obj !== signatureTextRef?.current) {
          canvas.remove(obj);
        }
      });

      // Establecer fondo y actualizar control
      if (plantilla.bgType === "color") {
        canvas.setBackgroundColor(plantilla.bgValue, () => canvas.renderAll());
        setCurrentBgColor(plantilla.bgValue);
        console.log("🎨 Fondo establecido a color:", plantilla.bgValue);
      } else if (plantilla.bgType === "image" && plantilla.bgValue) {
        fabric.Image.fromURL(plantilla.bgValue, (img) => {
          // Ajustar la imagen de fondo al tamaño del canvas
          img.scaleToWidth(canvas.getWidth() * 2); // Multiplicamos por 2 para compensar la escala de 0.5
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          console.log("🖼️ Fondo establecido a imagen");
        });
      }

      // Actualizar el texto de cita y sus controles
      if (plantilla.quote && quoteTextRef?.current) {
        // Determinar posición original y otras propiedades
        const quoteObj = plantilla.quote;
        const textColor = quoteObj.fill || "#000000";

        console.log("📏 Quote - Posición original:", { left: quoteObj.left, top: quoteObj.top });
        console.log("📏 Quote - Posición escalada:", { left: quoteObj.left * 0.5, top: quoteObj.top * 0.5 });
        console.log("🔤 Quote - Propiedades:", { 
          fontSize: quoteObj.fontSize, 
          fontFamily: quoteObj.fontFamily, 
          textAlign: quoteObj.textAlign, 
          color: textColor 
        });

        // Actualizar el objeto de texto
        quoteTextRef.current.set({
          text: quoteObj.text || "",
          left: quoteObj.left * 0.5, // Aplicar escala
          top: quoteObj.top * 0.5, // Aplicar escala
          fontSize: quoteObj.fontSize * 0.5, // Aplicar escala
          fontFamily: quoteObj.fontFamily,
          textAlign: quoteObj.textAlign,
          fill: textColor,
          styles: quoteObj.styles || {}
        });

        // Actualizar estados para controles UI - estos valores no se escalan
        setCurrentQuoteFontSize(quoteObj.fontSize);
        setCurrentQuoteFont(quoteObj.fontFamily);
        setCurrentQuoteAlign(quoteObj.textAlign);
        setCurrentTextColor(textColor);

        console.log("✅ Quote actualizado con propiedades:", quoteTextRef.current);
        console.log("✅ Estados de control Quote actualizados:", { 
          fontSize: quoteObj.fontSize, 
          fontFamily: quoteObj.fontFamily, 
          textAlign: quoteObj.textAlign, 
          textColor 
        });
      }

      // Actualizar el texto de firma y sus controles
      if (plantilla.signature && signatureTextRef?.current) {
        // Determinar posición original
        const signatureObj = plantilla.signature;
        // Usar el mismo color de texto si no tiene uno específico
        const signatureColor = signatureObj.fill || currentTextColor;

        console.log("📏 Signature - Posición original:", { left: signatureObj.left, top: signatureObj.top });
        console.log("📏 Signature - Posición escalada:", { left: signatureObj.left * 0.5, top: signatureObj.top * 0.5 });
        console.log("🔤 Signature - Propiedades:", { 
          fontSize: signatureObj.fontSize, 
          fontFamily: signatureObj.fontFamily, 
          textAlign: signatureObj.textAlign, 
          color: signatureColor 
        });

        // Actualizar el objeto de texto
        signatureTextRef.current.set({
          text: signatureObj.text || "",
          left: signatureObj.left * 0.5, // Aplicar escala
          top: signatureObj.top * 0.5, // Aplicar escala
          fontSize: signatureObj.fontSize * 0.5, // Aplicar escala
          fontFamily: signatureObj.fontFamily,
          textAlign: signatureObj.textAlign,
          fill: signatureColor,
          styles: signatureObj.styles || {}
        });

        // Actualizar estados para controles UI - estos valores no se escalan
        setCurrentSignatureFontSize(signatureObj.fontSize);
        setCurrentSignatureFont(signatureObj.fontFamily);
        setCurrentSignatureAlign(signatureObj.textAlign);

        console.log("✅ Signature actualizado con propiedades:", signatureTextRef.current);
        console.log("✅ Estados de control Signature actualizados:", { 
          fontSize: signatureObj.fontSize, 
          fontFamily: signatureObj.fontFamily, 
          textAlign: signatureObj.textAlign,
          signatureColor 
        });
      }

      // Añadir formas
      if (plantilla.shapes && plantilla.shapes.length > 0) {
        console.log("🔶 Añadiendo formas:", plantilla.shapes.length);

        plantilla.shapes.forEach((shape, index) => {
          console.log(`Forma ${index + 1}:`, shape);

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

          if (obj) {
            canvas.add(obj);
            console.log(`✅ Forma ${shape.type} añadida`);
          }
        });
      }

      canvas.renderAll();
      console.log("🎉 Renderizado completado");
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
    isCanvasReady,
    // Estados de control
    currentBgColor,
    currentTextColor,
    currentQuoteFontSize,
    currentSignatureFontSize,
    currentQuoteFont,
    currentSignatureFont,
    currentQuoteAlign,
    currentSignatureAlign
  };
}