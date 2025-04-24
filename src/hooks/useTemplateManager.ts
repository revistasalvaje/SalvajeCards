import { useState, useEffect, useContext } from 'react';
import { EditorContext } from '../App';
import {
  guardarPlantillaIndexedDB,
  loadAllPlantillasIndexedDB,
  cargarPlantillaIndexedDB,
  Plantilla
} from '../utils/templateManager';
import { fabric } from 'fabric';

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
  const [currentQuoteText, setCurrentQuoteText] = useState("");
  const [currentSignatureText, setCurrentSignatureText] = useState("");

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

      // IMMEDIATELY update all state variables
      const textColor = plantilla.quote?.fill || plantilla.signature?.fill || "#000000";
      const bgColor = plantilla.bgType === "color" ? plantilla.bgValue : "#ffffff";

      // Force state updates with immediate execution and also with timeouts
      setCurrentTextColor(textColor);
      setCurrentBgColor(bgColor);
      setCurrentQuoteFontSize(plantilla.quote?.fontSize || 48);
      setCurrentSignatureFontSize(plantilla.signature?.fontSize || 32);
      setCurrentQuoteFont(plantilla.quote?.fontFamily || "serif");
      setCurrentSignatureFont(plantilla.signature?.fontFamily || "serif");
      setCurrentQuoteAlign(plantilla.quote?.textAlign || "left");
      setCurrentSignatureAlign(plantilla.signature?.textAlign || "right");
      setCurrentQuoteText(plantilla.quote?.text || "");
      setCurrentSignatureText(plantilla.signature?.text || "");

      console.log("🎨 Estados actualizados:", {
        textColor,
        bgColor,
        quoteFontSize: plantilla.quote?.fontSize || 48,
        signatureFontSize: plantilla.signature?.fontSize || 32,
        quoteText: plantilla.quote?.text || "",
        signatureText: plantilla.signature?.text || ""
      });

      // Force React to re-render with double update pattern
      setTimeout(() => {
        setCurrentTextColor(prev => {
          console.log("⏰ Forzando actualización de color de texto:", textColor);
          return textColor;
        });
        setCurrentBgColor(prev => {
          console.log("⏰ Forzando actualización de color de fondo:", bgColor);
          return bgColor;
        });
      }, 50);

      const canvas = canvasInstance.current;

      // Resetear estados antes de cargar nueva plantilla
      resetStates();

      // Mantener los campos de texto pero eliminar otros objetos
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        if (obj !== quoteTextRef?.current && obj !== signatureTextRef?.current) {
          canvas.remove(obj);
        }
      });

      // Establecer fondo y actualizar control
      if (plantilla.bgType === "color") {
        canvas.setBackgroundImage(null, () => {
          canvas.setBackgroundColor(plantilla.bgValue, () => canvas.renderAll());
        });
        console.log("🎨 Fondo establecido a color:", plantilla.bgValue);
      } else if (plantilla.bgType === "image" && plantilla.bgValue) {
        fabric.Image.fromURL(plantilla.bgValue, (img) => {
          img.scaleToWidth(canvas.getWidth() * 2);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          console.log("🖼️ Fondo establecido a imagen");
        });
      }

      // Actualizar el texto de cita y sus controles
      if (plantilla.quote && quoteTextRef?.current) {
        const quoteObj = plantilla.quote;

        quoteTextRef.current.set({
          text: quoteObj.text || "",
          left: quoteObj.left * 0.5,
          top: quoteObj.top * 0.5,
          fontSize: quoteObj.fontSize * 0.5,
          fontFamily: quoteObj.fontFamily,
          textAlign: quoteObj.textAlign,
          fill: textColor,
          width: quoteObj.width ? quoteObj.width * 0.5 : canvas.getWidth() - 200,
          styles: quoteObj.styles || {}
        });

        console.log("✅ Quote actualizado con propiedades:", quoteTextRef.current);
      }

      // Actualizar el texto de firma y sus controles
      if (plantilla.signature && signatureTextRef?.current) {
        const signatureObj = plantilla.signature;
        const signatureColor = signatureObj.fill || textColor;

        signatureTextRef.current.set({
          text: signatureObj.text || "",
          left: signatureObj.left * 0.5,
          top: signatureObj.top * 0.5,
          fontSize: signatureObj.fontSize * 0.5,
          fontFamily: signatureObj.fontFamily,
          textAlign: signatureObj.textAlign,
          fill: signatureColor,
          width: signatureObj.width ? signatureObj.width * 0.5 : 200,
          styles: signatureObj.styles || {}
        });

        console.log("✅ Signature actualizado con propiedades:", signatureTextRef.current);
      }

      // Añadir formas
      if (plantilla.shapes && plantilla.shapes.length > 0) {
        console.log("🔶 Añadiendo formas:", plantilla.shapes.length);

        plantilla.shapes.forEach((shape, index) => {
          let obj;
          if (shape.type === "rect") {
            obj = new fabric.Rect({
              left: shape.left * 0.5,
              top: shape.top * 0.5,
              width: (shape.width || 120) * 0.5,
              height: (shape.height || 80) * 0.5,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth * 0.5,
              fill: "transparent",
            });
          } else if (shape.type === "circle") {
            obj = new fabric.Circle({
              left: shape.left * 0.5,
              top: shape.top * 0.5,
              radius: (shape.radius || 50) * 0.5,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth * 0.5,
              fill: "transparent",
            });
          } else if (shape.type === "line") {
            obj = new fabric.Line(
              [
                shape.left * 0.5, 
                shape.top * 0.5, 
                (shape.left + 150) * 0.5, 
                shape.top * 0.5
              ], 
              {
                stroke: shape.stroke,
                strokeWidth: shape.strokeWidth * 0.5,
              }
            );
          } else if (shape.type === "group") {
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

  const resetStates = () => {
    console.log("Reseteando estados para nueva carga");
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
    // Estados de control
    currentBgColor,
    currentTextColor,
    currentQuoteFontSize,
    currentSignatureFontSize,
    currentQuoteFont,
    currentSignatureFont,
    currentQuoteAlign,
    currentSignatureAlign,
    currentQuoteText,
    currentSignatureText
  };
}