    import { useEffect, useRef, useState } from "react";
    import { fabric } from "fabric";

    export function useEditor() {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const canvasInstance = useRef<fabric.Canvas | null>(null);

      const [quote, setQuote] = useState("");
      const [signature, setSignature] = useState("");
      const [uploadedBgImage, setUploadedBgImage] = useState<string | null>(null);
      const [palette, setPalette] = useState<string[]>([]);
      const [bgColor, setBgColor] = useState("#ffffff");
      const [textColor, setTextColor] = useState("#000000");
      const [showBgPicker, setShowBgPicker] = useState(false);
      const [showTextPicker, setShowTextPicker] = useState(false);
      const [paletteClickCount, setPaletteClickCount] = useState(0);

      const [strokeColor, setStrokeColor] = useState("#000000");
      const [strokeWidth, setStrokeWidth] = useState(2);

      useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) {
          console.error("canvasRef no disponible");
          return;
        }

        console.log("Inicializando canvas...");

        // Es fundamental asegurarse que el elemento canvas existe en el DOM
        const canvas = new fabric.Canvas(canvasEl, {
          backgroundColor: "white",
          width: 1080,
          height: 1080, // Inicialmente cuadrado 1:1
          selection: false,
        });

        const scale = 0.5;
        canvas.setZoom(scale);
        canvas.setWidth(1080 * scale);
        canvas.setHeight(1080 * scale);

        canvasInstance.current = canvas;
        console.log("Canvas inicializado correctamente:", canvasInstance.current);

        // Borrar objeto seleccionado con Supr
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Delete" || e.key === "Backspace") {
            const active = canvas.getActiveObject();
            if (active) {
              canvas.remove(active);
              canvas.requestRenderAll();
            }
          }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
          console.log("Destruyendo canvas");
          window.removeEventListener("keydown", handleKeyDown);
          canvas.dispose();
          canvasInstance.current = null;
        };
      }, []);

      // Añadir forma al canvas
      const addShape = (type: "line" | "arrow" | "rect" | "circle") => {
        const canvas = canvasInstance.current;
        if (!canvas) {
          console.error("Canvas no disponible para añadir forma");
          return;
        }

        let shape: fabric.Object;
        const commonProps = {
          stroke: strokeColor,
          strokeWidth,
          fill: "transparent",
          selectable: true,
          hasControls: true,
          hasBorders: true,
        };

        switch (type) {
          case "line":
            shape = new fabric.Line([0, 0, 150, 0], {
              left: 100,
              top: 100,
              ...commonProps,
            });
            break;

          case "arrow": {
            const offset = strokeWidth / 2;

            const line = new fabric.Line([0, 0, 150, 0], {
              ...commonProps,
              left: 0,
              top: -offset,
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

            shape = new fabric.Group([line, triangle], {
              left: 100,
              top: 100,
              ...commonProps,
            });

            break;
          }

          case "rect":
            shape = new fabric.Rect({
              left: 100,
              top: 100,
              width: 120,
              height: 80,
              ...commonProps,
            });
            break;

          case "circle":
            shape = new fabric.Circle({
              left: 150,
              top: 150,
              radius: 50,
              ...commonProps,
            });
            break;

          default:
            return;
        }

        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.requestRenderAll();
      };

      // Cambiar color de trazo
      const handleStrokeColorChange = (color: string) => {
        setStrokeColor(color);
        const active = canvasInstance.current?.getActiveObject();
        if (active) {
          if (active.type === "group") {
            (active as fabric.Group).forEachObject((obj) => {
              obj.set("stroke", color);
              if (obj.type === "triangle") obj.set("fill", color);
            });
          } else {
            active.set("stroke", color);
          }
          canvasInstance.current?.requestRenderAll();
        }
      };

      // Cambiar grosor de trazo
      const handleStrokeWidthChange = (width: number) => {
        setStrokeWidth(width);
        const active = canvasInstance.current?.getActiveObject();
        if (!active) return;

        if (active.type === "group") {
          const group = active as fabric.Group;
          group.forEachObject((obj) => {
            obj.set("strokeWidth", width);
            if (obj.type === "line") {
              obj.top = -width / 2; // reajuste vertical de la línea
            }
          });
          group.dirty = true;
        } else {
          active.set("strokeWidth", width);
        }

        canvasInstance.current?.requestRenderAll();
      };

      // Verificar si el canvas está inicializado
      const isCanvasReady = () => {
        return canvasInstance.current !== null;
      };

      // Modificación: Actualizar función para manejar texto
      const updateText = (content: string, type: "quote" | "signature") => {
        const canvas = canvasInstance.current;
        if (!canvas) return;

        const name = type === "signature" ? "signature" : undefined;
        const text = type === "signature" ? signature : quote;
        const setText = type === "signature" ? setSignature : setQuote;
        const isSignature = type === "signature";

        setText(content);

        let obj = canvas
          .getObjects()
          .find(
            (o) =>
              o.type === "textbox" &&
              (isSignature ? o.name === "signature" : o.name !== "signature"),
          ) as fabric.Textbox;

        if (obj) {
          obj.text = content;
          canvas.renderAll();
        } else {
          // Usar Textbox en lugar de IText para permitir envolver texto
          const newText = new fabric.Textbox(content, {
            left: isSignature ? canvas.getWidth() - 60 : 100,
            top: isSignature ? canvas.getHeight() - 60 : 100,
            originX: isSignature ? "right" : "left",
            originY: isSignature ? "bottom" : "top",
            fontSize: isSignature ? 32 : 48,
            fill: textColor,
            fontFamily: "serif",
            editable: true,
            name: isSignature ? "signature" : "quote",
            width: isSignature ? 200 : canvas.getWidth() - 200, // Ancho máximo para cita y firma
            breakWords: true, // Permitir romper palabras largas
            textAlign: isSignature ? "right" : "left", // Alineación predeterminada
          });
          canvas.add(newText).setActiveObject(newText);
          canvas.renderAll();
        }
      };

      return {
        canvasRef,
        canvasInstance,
        isCanvasReady,
        quote,
        setQuote,
        signature,
        setSignature,
        uploadedBgImage,
        setUploadedBgImage,
        palette,
        setPalette,
        bgColor,
        setBgColor,
        textColor,
        setTextColor,
        showBgPicker,
        setShowBgPicker,
        showTextPicker,
        setShowTextPicker,
        paletteClickCount,
        setPaletteClickCount,
        strokeColor,
        strokeWidth,
        addShape,
        handleStrokeColorChange,
        handleStrokeWidthChange,
        updateText,
      };
    }