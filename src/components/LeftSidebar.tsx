import React, { useContext, useEffect, useState } from "react";
import {
  guardarPlantillaIndexedDB,
  loadAllPlantillasIndexedDB,
  cargarPlantillaIndexedDB,
  Plantilla,
} from "../utils/templateManager";
import { EditorContext } from "../App";
import { useNotification } from "../context/NotificationContext";
import { fabric } from "fabric";

const LeftSidebar: React.FC = () => {
  const { canvasInstance } = useContext(EditorContext);
  const { showNotification } = useNotification();
  const [nombre, setNombre] = useState("");
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
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

  const createArrow = (canvas: fabric.Canvas, shapeData: any) => {
    const commonProps = {
      stroke: shapeData.stroke || "#000000",
      strokeWidth: shapeData.strokeWidth || 2,
      left: shapeData.left || 100,
      top: shapeData.top || 100,
      fill: "transparent",
    };

    // Create arrow components
    const line = new fabric.Line([0, 0, 150, 0], {
      ...commonProps,
      left: 0,
      top: -commonProps.strokeWidth/2,
    });

    const triangle = new fabric.Triangle({
      left: 150,
      top: 0,
      width: 12,
      height: 12,
      angle: 90,
      originX: "center",
      originY: "center",
      fill: commonProps.stroke,
      stroke: commonProps.stroke,
      strokeWidth: commonProps.strokeWidth,
      selectable: false,
    });

    // Group them together
    const arrow = new fabric.Group([line, triangle], commonProps);

    return arrow;
  };

  const handleCargar = async (id: string) => {
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

      // Find existing text objects before clearing
      const existingQuote = canvas.getObjects().find(obj => obj.name === 'quote') as fabric.Textbox;
      const existingSignature = canvas.getObjects().find(obj => obj.name === 'signature') as fabric.Textbox;

      // Save their properties to restore
      const quoteObj = existingQuote ? {
        left: existingQuote.left,
        top: existingQuote.top,
        width: existingQuote.width,
        originX: existingQuote.originX,
        originY: existingQuote.originY
      } : null;

      const signatureObj = existingSignature ? {
        left: existingSignature.left,
        top: existingSignature.top,
        width: existingSignature.width,
        originX: existingSignature.originX,
        originY: existingSignature.originY
      } : null;

      // Keep references to text objects and remove them temporarily
      const textObjects = canvas.getObjects().filter(obj => 
        obj.name === 'quote' || obj.name === 'signature'
      );

      textObjects.forEach(obj => canvas.remove(obj));

      // Clear other objects from canvas
      canvas.getObjects().slice().forEach(obj => canvas.remove(obj));

      // Set background
      if (plantilla.bgType === "color") {
        canvas.setBackgroundColor(plantilla.bgValue, () => canvas.renderAll());
      } else if (plantilla.bgType === "image" && plantilla.bgValue) {
        fabric.Image.fromURL(plantilla.bgValue, (img) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
      }

      // Add quote with proper properties
      if (plantilla.quote) {
        const quoteProps = {
          left: quoteObj?.left || canvas.getWidth() / 2,
          top: quoteObj?.top || canvas.getHeight() / 3,
          width: quoteObj?.width || canvas.getWidth() * 0.8,
          originX: quoteObj?.originX || "center",
          originY: quoteObj?.originY || "center",
          fontSize: plantilla.quote.fontSize || 48,
          fontFamily: plantilla.quote.fontFamily || "serif",
          textAlign: plantilla.quote.textAlign || "center",
          fill: plantilla.quote.fill || "#000000",
          name: "quote",
          text: plantilla.quote.text || "",
          selectable: true,
          editable: true,
        };

        const q = new fabric.Textbox(plantilla.quote.text || "", quoteProps);
        canvas.add(q);

        // Trigger UI update event - could be custom event for real app
        window.dispatchEvent(new CustomEvent('quoteUpdated', { 
          detail: { text: plantilla.quote.text, styles: {
            fontSize: plantilla.quote.fontSize,
            fontFamily: plantilla.quote.fontFamily,
            textAlign: plantilla.quote.textAlign
          }}
        }));
      }

      // Add signature with proper properties
      if (plantilla.signature) {
        const signatureProps = {
          left: signatureObj?.left || canvas.getWidth() / 2,
          top: signatureObj?.top || canvas.getHeight() * 0.85,
          width: signatureObj?.width || canvas.getWidth() * 0.6,
          originX: signatureObj?.originX || "center",
          originY: signatureObj?.originY || "center",
          fontSize: plantilla.signature.fontSize || 32,
          fontFamily: plantilla.signature.fontFamily || "serif",
          textAlign: plantilla.signature.textAlign || "center",
          fill: plantilla.signature.fill || "#000000",
          name: "signature",
          text: plantilla.signature.text || "",
          selectable: true,
          editable: true,
        };

        const s = new fabric.Textbox(plantilla.signature.text || "", signatureProps);
        canvas.add(s);

        // Trigger UI update event
        window.dispatchEvent(new CustomEvent('signatureUpdated', { 
          detail: { text: plantilla.signature.text, styles: {
            fontSize: plantilla.signature.fontSize,
            fontFamily: plantilla.signature.fontFamily,
            textAlign: plantilla.signature.textAlign
          }}
        }));
      }

      // Add shapes with proper handling for each type
      if (plantilla.shapes && plantilla.shapes.length > 0) {
        plantilla.shapes.forEach((shape) => {
          if (shape.type === 'textbox') return; // Skip textbox objects

          let obj;

          if (shape.isArrow || (shape.type === "group" && shape.objects)) {
            // Recreate arrow
            obj = createArrow(canvas, shape);
          } 
          else if (shape.type === "rect") {
            obj = new fabric.Rect({
              left: shape.left,
              top: shape.top,
              width: shape.width || 120,
              height: shape.height || 80,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth,
              fill: "transparent",
            });
          } 
          else if (shape.type === "circle") {
            obj = new fabric.Circle({
              left: shape.left,
              top: shape.top,
              radius: shape.radius || 50,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth,
              fill: "transparent",
            });
          } 
          else if (shape.type === "line") {
            obj = new fabric.Line(
              [shape.left, shape.top, shape.left + (shape.width || 150), shape.top], 
              {
                stroke: shape.stroke,
                strokeWidth: shape.strokeWidth,
              }
            );
          }

          if (obj) {
            canvas.add(obj);
          }
        });
      }

      canvas.renderAll();
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
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleGuardar}
          disabled={guardando || !nombre.trim() || !isCanvasReady()}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded
            ${(guardando || !nombre.trim() || !isCanvasReady()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
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
          <div className="text-center py-6 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
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