// Template rendering logic
import { fabric } from 'fabric';
import { Plantilla } from '../types/template';

// Scale adjustment for canvas zoom
const SCALE_FACTOR = 0.5;

export async function renderTemplate(
  canvas: fabric.Canvas, 
  plantilla: Plantilla,
  quoteTextRef: React.MutableRefObject<fabric.Textbox | null>,
  signatureTextRef: React.MutableRefObject<fabric.Textbox | null>
) {
  if (!canvas) {
    throw new Error("Canvas is not available");
  }

  console.log("📄 Rendering template:", plantilla.name);

  // Clear canvas objects except text elements
  const objects = canvas.getObjects();
  objects.forEach(obj => {
    if (obj !== quoteTextRef?.current && obj !== signatureTextRef?.current) {
      canvas.remove(obj);
    }
  });

  // Set background
  await setBackground(canvas, plantilla.bgType, plantilla.bgValue);

  // Set text elements
  setTextElements(canvas, plantilla, quoteTextRef, signatureTextRef);

  // Add shapes
  addShapes(canvas, plantilla.shapes);

  canvas.renderAll();
  console.log("🎉 Template rendering complete");
}

async function setBackground(canvas: fabric.Canvas, bgType: string, bgValue: string): Promise<void> {
  return new Promise((resolve) => {
    if (bgType === "color") {
      canvas.setBackgroundImage(null, () => {
        canvas.setBackgroundColor(bgValue, () => {
          canvas.renderAll();
          resolve();
        });
      });
      console.log("🎨 Background set to color:", bgValue);
    } else if (bgType === "image" && bgValue) {
      fabric.Image.fromURL(bgValue, (img) => {
        img.scaleToWidth(canvas.getWidth() * (1/SCALE_FACTOR));
        canvas.setBackgroundImage(img, () => {
          canvas.renderAll();
          resolve();
        });
        console.log("🖼️ Background set to image");
      });
    } else {
      resolve();
    }
  });
}

function setTextElements(
  canvas: fabric.Canvas,
  plantilla: Plantilla,
  quoteTextRef: React.MutableRefObject<fabric.Textbox | null>,
  signatureTextRef: React.MutableRefObject<fabric.Textbox | null>
) {
  // Extract text color (for state updates)
  let textColor = "#000000";

  // Quote text
  if (plantilla.quote && quoteTextRef?.current) {
    const quoteObj = plantilla.quote;
    textColor = quoteObj.fill || "#000000";

    quoteTextRef.current.set({
      text: quoteObj.text || "",
      left: quoteObj.left * SCALE_FACTOR,
      top: quoteObj.top * SCALE_FACTOR,
      fontSize: quoteObj.fontSize * SCALE_FACTOR,
      fontFamily: quoteObj.fontFamily,
      textAlign: quoteObj.textAlign,
      fill: textColor,
      width: quoteObj.width ? quoteObj.width * SCALE_FACTOR : canvas.getWidth() - 200,
      styles: quoteObj.styles || {}
    });
  }

  // Signature text
  if (plantilla.signature && signatureTextRef?.current) {
    const signatureObj = plantilla.signature;
    const signatureColor = signatureObj.fill || textColor;

    signatureTextRef.current.set({
      text: signatureObj.text || "",
      left: signatureObj.left * SCALE_FACTOR,
      top: signatureObj.top * SCALE_FACTOR,
      fontSize: signatureObj.fontSize * SCALE_FACTOR,
      fontFamily: signatureObj.fontFamily,
      textAlign: signatureObj.textAlign,
      fill: signatureColor,
      width: signatureObj.width ? signatureObj.width * SCALE_FACTOR : 200,
      styles: signatureObj.styles || {}
    });
  }

  return textColor;
}

function addShapes(canvas: fabric.Canvas, shapes: Plantilla['shapes']) {
  if (!shapes || shapes.length === 0) return;

  console.log("🔶 Adding shapes:", shapes.length);

  shapes.forEach((shape, index) => {
    let obj;

    switch(shape.type) {
      case "rect":
        obj = new fabric.Rect({
          left: shape.left * SCALE_FACTOR,
          top: shape.top * SCALE_FACTOR,
          width: (shape.width || 120) * SCALE_FACTOR,
          height: (shape.height || 80) * SCALE_FACTOR,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth * SCALE_FACTOR,
          fill: "transparent",
        });
        break;

      case "circle":
        obj = new fabric.Circle({
          left: shape.left * SCALE_FACTOR,
          top: shape.top * SCALE_FACTOR,
          radius: (shape.radius || 50) * SCALE_FACTOR,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth * SCALE_FACTOR,
          fill: "transparent",
        });
        break;

      case "line":
        obj = new fabric.Line(
          [
            shape.left * SCALE_FACTOR, 
            shape.top * SCALE_FACTOR, 
            (shape.left + 150) * SCALE_FACTOR, 
            shape.top * SCALE_FACTOR
          ], 
          {
            stroke: shape.stroke,
            strokeWidth: shape.strokeWidth * SCALE_FACTOR,
          }
        );
        break;

      case "group":
        // For arrows (group of line + triangle)
        const line = new fabric.Line([0, 0, 150 * SCALE_FACTOR, 0], {
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth * SCALE_FACTOR,
          left: 0,
          top: -(shape.strokeWidth * SCALE_FACTOR) / 2,
        });

        const triangle = new fabric.Triangle({
          left: 150 * SCALE_FACTOR,
          top: 0,
          width: 12 * SCALE_FACTOR,
          height: 12 * SCALE_FACTOR,
          angle: 90,
          originX: "center",
          originY: "center",
          fill: shape.stroke,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth * SCALE_FACTOR,
          selectable: false,
        });

        obj = new fabric.Group([line, triangle], {
          left: shape.left * SCALE_FACTOR,
          top: shape.top * SCALE_FACTOR,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth * SCALE_FACTOR,
          fill: "transparent",
        });
        break;
    }

    if (obj) {
      canvas.add(obj);
      console.log(`✅ Shape ${shape.type} added`);
    }
  });
}