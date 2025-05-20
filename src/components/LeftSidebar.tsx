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
      showNotification('Ingresa un nombre para la plantilla', 'warning');
      return;
    }

    try {
      setGuardando(true);
      await guardarPlantillaIndexedDB(canvasInstance.current, nombre);
      setNombre("");
      showNotification(`Plantilla "${nombre}" guardada`, 'success');

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
        showNotification('No se encontró la plantilla', 'error');
        return;
      }

      const canvas = canvasInstance.current;
      canvas.clear();

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
          left: plantilla.quote.left || canvas.getWidth() / 2,
          top: plantilla.quote.top || canvas.getHeight() / 3,
          width: plantilla.quote.width || canvas.getWidth() * 0.8,
          originX: plantilla.quote.originX || "center",
          originY: plantilla.quote.originY || "center",
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

        // Actualizar los campos de texto en la interfaz
        if (plantilla.quote.text) {
          try {
            // Disparar un evento personalizado para actualizar la UI
            window.dispatchEvent(new CustomEvent('quoteUpdate', { 
              detail: plantilla.quote.text 
            }));

            // Actualizar el valor del textarea directamente
            const quoteTextarea = document.querySelector('textarea[placeholder*="cita"]') as HTMLTextAreaElement;
            if (quoteTextarea) {
              quoteTextarea.value = plantilla.quote.text;
              // Disparar evento change para actualizar el estado de React
              const event = new Event('change', { bubbles: true });
              quoteTextarea.dispatchEvent(event);
            }
          } catch(e) {
            console.error("Error al actualizar interfaz de cita:", e);
          }
        }
      }

      // Add signature with proper properties
      if (plantilla.signature) {
        const signatureProps = {
          left: plantilla.signature.left || canvas.getWidth() / 2,
          top: plantilla.signature.top || canvas.getHeight() * 0.85,
          width: plantilla.signature.width || canvas.getWidth() * 0.6,
          originX: plantilla.signature.originX || "center",
          originY: plantilla.signature.originY || "center",
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

        // Actualizar los campos de texto en la interfaz
        if (plantilla.signature.text) {
          try {
            // Disparar un evento personalizado para actualizar la UI
            window.dispatchEvent(new CustomEvent('signatureUpdate', { 
              detail: plantilla.signature.text 
            }));

            // Actualizar el valor del textarea directamente
            const signatureTextarea = document.querySelector('textarea[placeholder*="Autor"]') as HTMLTextAreaElement;
            if (signatureTextarea) {
              signatureTextarea.value = plantilla.signature.text;
              // Disparar evento change para actualizar el estado de React
              const event = new Event('change', { bubbles: true });
              signatureTextarea.dispatchEvent(event);
            }
          } catch(e) {
            console.error("Error al actualizar interfaz de firma:", e);
          }
        }
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
                lockScalingY: true, // Evitar distorsión vertical
              }
            );
          }

          if (obj) {
            canvas.add(obj);
          }
        });
      }

      canvas.renderAll();
      showNotification(`Plantilla "${plantilla.name}" cargada`, 'success');
    } catch (error) {
      console.error("Error al cargar la plantilla:", error);
      showNotification('Error al cargar la plantilla', 'error');
    }
  };

  return (
    <div className="sidebar sidebar-left">
      <h2 className="section-title">Plantillas</h2>

      <div className="subsection">
        <input
          type="text"
          placeholder="Nombre plantilla"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input"
        />

        <button
          onClick={handleGuardar}
          disabled={guardando || !nombre.trim() || !canvasInstance.current}
          className="btn btn-primary w-full"
        >
          {guardando ? (
            <>
              <svg className="spinner inline-block w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : "Guardar plantilla"}
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center h-24">
          <svg className="spinner w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
};

export default LeftSidebar;