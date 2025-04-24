import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

export function useEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);

  // Text object references - critical for proper template loading/saving
  const quoteTextRef = useRef<fabric.Textbox | null>(null);
  const signatureTextRef = useRef<fabric.Textbox | null>(null);

  // State
  const [quote, setQuote] = useState("");
  const [signature, setSignature] = useState("");
  const [uploadedBgImage, setUploadedBgImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Initialize canvas
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    console.log("Initializing canvas...");

    const canvas = new fabric.Canvas(canvasEl, {
      backgroundColor: "white",
      width: 1080,
      height: 1080,
      selection: false,
    });

    // Apply scale for better viewing
    const scale = 0.5;
    canvas.setZoom(scale);
    canvas.setWidth(1080 * scale);
    canvas.setHeight(1080 * scale);

    canvasInstance.current = canvas;

    // Initialize text fields
    initializeTextFields(canvas);

    // Add guidelines
    addGuidelines(canvas);

    // Handle key events for deletion
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const active = canvas.getActiveObject();
        if (active && active !== quoteTextRef.current && active !== signatureTextRef.current) {
          canvas.remove(active);
          canvas.requestRenderAll();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
      canvasInstance.current = null;
      quoteTextRef.current = null;
      signatureTextRef.current = null;
    };
  }, []);

  // Add guide lines that won't be exported
  const addGuidelines = (canvas: fabric.Canvas) => {
    // Calculate dimensions
    const width = canvas.getWidth() / 0.5; // Compensate for scale
    const height = canvas.getHeight() / 0.5;

    // Center horizontal guideline
    const centerHLine = new fabric.Line([0, height / 2, width, height / 2], {
      stroke: 'rgba(0, 140, 255, 0.5)',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true, // Won't be exported
    });

    // Center vertical guideline
    const centerVLine = new fabric.Line([width / 2, 0, width / 2, height], {
      stroke: 'rgba(0, 140, 255, 0.5)',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true, // Won't be exported
    });

    // 5% margin guidelines
    const marginSize = width * 0.05;

    // Top margin
    const topMargin = new fabric.Line([0, marginSize, width, marginSize], {
      stroke: 'rgba(255, 140, 0, 0.5)',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });

    // Bottom margin
    const bottomMargin = new fabric.Line([0, height - marginSize, width, height - marginSize], {
      stroke: 'rgba(255, 140, 0, 0.5)',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });

    // Left margin
    const leftMargin = new fabric.Line([marginSize, 0, marginSize, height], {
      stroke: 'rgba(255, 140, 0, 0.5)',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });

    // Right margin
    const rightMargin = new fabric.Line([width - marginSize, 0, width - marginSize, height], {
      stroke: 'rgba(255, 140, 0, 0.5)',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });

    // Apply scale factor to position guidelines correctly
    const scaleFactor = 0.5;
    [centerHLine, centerVLine, topMargin, bottomMargin, leftMargin, rightMargin].forEach(line => {
      line.set({
        scaleX: scaleFactor,
        scaleY: scaleFactor,
      });
    });

    // Add guidelines to canvas
    canvas.add(centerHLine, centerVLine, topMargin, bottomMargin, leftMargin, rightMargin);

    // Make sure guidelines stay at the bottom layer
    canvas.sendToBack(centerHLine);
    canvas.sendToBack(centerVLine);
    canvas.sendToBack(topMargin);
    canvas.sendToBack(bottomMargin);
    canvas.sendToBack(leftMargin);
    canvas.sendToBack(rightMargin);
  };

  // Initialize text fields
  const initializeTextFields = (canvas: fabric.Canvas) => {
    // If text objects already exist on canvas load, don't recreate them
    if (canvas.getObjects().some(obj => (obj as any).name === "quote") ||
        canvas.getObjects().some(obj => (obj as any).name === "signature")) {
      console.log("Text fields already exist on canvas, skipping initialization");
      return;
    }

    console.log("Creating initial text fields");

    // Quote text - updated with new default size of 96
    const quoteText = new fabric.Textbox("", {
      left: 100,
      top: 100,
      fontSize: 96 * 0.5, // Size 96 adjusted for 0.5 scale
      fontFamily: "serif",
      fill: textColor,
      width: (canvas.getWidth() - 200),
      breakWords: true,
      name: "quote",
      selectable: true,
      hasControls: true,
      editingBorderColor: "#2196F3",
      borderColor: "#2196F3",
      textAlign: "left",
    });

    // Signature text - updated with new default size of 64
    const signatureText = new fabric.Textbox("", {
      left: canvas.getWidth() - 60,
      top: canvas.getHeight() - 60,
      fontSize: 64 * 0.5, // Size 64 adjusted for 0.5 scale
      fontFamily: "serif",
      fill: textColor,
      width: 200,
      breakWords: true,
      name: "signature",
      originX: "right",
      originY: "bottom",
      selectable: true,
      hasControls: true,
      editingBorderColor: "#2196F3",
      borderColor: "#2196F3",
      textAlign: "right",
    });

    canvas.add(quoteText);
    canvas.add(signatureText);

    // Store references to text objects
    quoteTextRef.current = quoteText;
    signatureTextRef.current = signatureText;

    // Find text objects if they already exist
    canvas.getObjects().forEach(obj => {
      if ((obj as any).name === "quote") quoteTextRef.current = obj as fabric.Textbox;
      if ((obj as any).name === "signature") signatureTextRef.current = obj as fabric.Textbox;
    });

    canvas.renderAll();
  };

  // Add shape to canvas
  const addShape = (type: "line" | "arrow" | "rect" | "circle") => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

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

  // Update stroke color
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

  // Update stroke width
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

  // Update text content
  const updateText = (content: string, type: "quote" | "signature") => {
    if (type === "quote") {
      setQuote(content);
      if (quoteTextRef.current) {
        quoteTextRef.current.set({ text: content });
        canvasInstance.current?.renderAll();
      }
    } else {
      setSignature(content);
      if (signatureTextRef.current) {
        signatureTextRef.current.set({ text: content });
        canvasInstance.current?.renderAll();
      }
    }
  };

  // Apply text style
  const applyTextStyle = (type: "quote" | "signature", style: object) => {
    const targetRef = type === "quote" ? quoteTextRef : signatureTextRef;
    if (targetRef?.current) {
      targetRef.current.set(style);
      canvasInstance.current?.renderAll();
    }
  };

  return {
    canvasRef,
    canvasInstance,
    quoteTextRef,
    signatureTextRef,
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
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    addShape,
    handleStrokeColorChange,
    handleStrokeWidthChange,
    updateText,
    applyTextStyle
  };
}