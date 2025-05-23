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

  // Text styling
  const [quoteFontSize, setQuoteFontSize] = useState(48);
  const [signatureFontSize, setSignatureFontSize] = useState(32);
  const [quoteFont, setQuoteFont] = useState("serif");
  const [signatureFont, setSignatureFont] = useState("serif");
  const [quoteAlign, setQuoteAlign] = useState("left");
  const [signatureAlign, setSignatureAlign] = useState("left");

  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) {
      console.error("canvasRef no disponible");
      return;
    }

    console.log("Inicializando canvas...");

    const canvas = new fabric.Canvas(canvasEl, {
      backgroundColor: "white",
      width: 1080,
      height: 1350,
      selection: true,
    });

    const scale = 0.5;
    canvas.setZoom(scale);
    canvas.setWidth(1080 * scale);
    canvas.setHeight(1350 * scale);

    canvasInstance.current = canvas;
    console.log("Canvas inicializado correctamente:", canvasInstance.current);

    initializeTextFields(canvas);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const active = canvas.getActiveObject();
        if (active && active.type !== "textbox") {
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

  const initializeTextFields = (canvas: fabric.Canvas) => {
    const margin = 50;
    const availableWidth = canvas.getWidth() - (margin * 2);

    // Crear campo para la cita - posición fija arriba izquierda
    const quoteText = new fabric.Textbox("", {
      left: margin,
      top: margin,
      fontSize: quoteFontSize,
      fontFamily: quoteFont,
      fill: textColor,
      textAlign: "left",
      width: availableWidth,
      name: "quote",
      editable: true,
      lockUniScaling: true,
      centeredRotation: true,
      lockScalingX: true,
      lockScalingY: true,
    });

    // Crear campo para la firma - posición fija abajo izquierda
    const signatureText = new fabric.Textbox("", {
      left: margin,
      top: canvas.getHeight() * 0.85,
      fontSize: signatureFontSize,
      fontFamily: signatureFont,
      fill: textColor,
      textAlign: "left",
      width: availableWidth,
      name: "signature",
      editable: true,
      lockUniScaling: true,
      centeredRotation: true,
      lockScalingX: true,
      lockScalingY: true,
    });

    canvas.add(quoteText);
    canvas.add(signatureText);
    canvas.renderAll();
  };

  const updateTextField = (type: "quote" | "signature", text: string) => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const textObject = canvas.getObjects().find(
      (obj) => obj.name === type
    ) as fabric.Textbox;

    if (textObject) {
      textObject.set({ text });
      canvas.renderAll();
    } else {
      initializeTextFields(canvas);
    }
  };

  const applyTextStyleToSelection = (obj: fabric.Textbox, styleName: string, value: any) => {
    if (!obj.isEditing) {
      obj.set({ [styleName]: value });
      return;
    }

    const selectionStart = obj.selectionStart || 0;
    const selectionEnd = obj.selectionEnd || 0;

    if (selectionStart === selectionEnd) {
      obj.set({ [styleName]: value });
    } else {
      for (let i = selectionStart; i < selectionEnd; i++) {
        obj.setSelectionStyles({ [styleName]: value }, i, i + 1);
      }
    }
  };

  const updateTextStyle = (type: "quote" | "signature", style: object) => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const textObject = canvas.getObjects().find(
      (obj) => obj.name === type
    ) as fabric.Textbox;

    if (textObject) {
      Object.entries(style).forEach(([key, value]) => {
        applyTextStyleToSelection(textObject, key, value);
      });
      canvas.renderAll();
    }
  };

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
          lockScalingY: true,
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
          lockScalingY: true,
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

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    const active = canvasInstance.current?.getActiveObject();
    if (!active) return;

    if (active.type === "group") {
      const group = active as fabric.Group;
      group.forEachObject((obj) => {
        obj.set("strokeWidth", width);
        if (obj.type === "line") {
          obj.top = -width / 2;
        }
      });
      group.dirty = true;
    } else {
      active.set("strokeWidth", width);
    }

    canvasInstance.current?.requestRenderAll();
  };

  const isCanvasReady = () => {
    return canvasInstance.current !== null;
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
    updateTextField,
    updateTextStyle,
    quoteFontSize,
    setQuoteFontSize,
    signatureFontSize,
    setSignatureFontSize,
    quoteFont,
    setQuoteFont,
    signatureFont,
    setSignatureFont,
    quoteAlign,
    setQuoteAlign,
    signatureAlign,
    setSignatureAlign,
  };
}