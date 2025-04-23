// Modificaciones para App.tsx
// 1. Actualizar la función de manejo de texto para usar Textbox en lugar de IText
// 2. Asegurarse de que la configuración de texto tenga un ancho adecuado

// 1. Modificación en la función updateText

// Buscar:
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
        o.type === "i-text" &&
        (isSignature ? o.name === "signature" : o.name !== "signature"),
    ) as fabric.IText;

  if (obj) {
    obj.text = content;
    canvas.renderAll();
  } else {
    const newText = new fabric.IText(content, {
      left: isSignature ? canvas.getWidth() - 60 : 100,
      top: isSignature ? canvas.getHeight() - 60 : 100,
      originX: isSignature ? "right" : "left",
      originY: isSignature ? "bottom" : "top",
      fontSize: isSignature ? 32 : 48,
      fill: textColor,
      fontFamily: "serif",
      editable: true,
      name,
    });
    canvas.add(newText).setActiveObject(newText);
    canvas.renderAll();
  }
};

// Reemplazar por:
const updateText = (content: string, type: "quote" | "signature") => {
  const canvas = canvasInstance.current;
  if (!canvas) return;

  const name = type === "signature" ? "signature" : "quote";
  const text = type === "signature" ? signature : quote;
  const setText = type === "signature" ? setSignature : setQuote;
  const isSignature = type === "signature";

  setText(content);

  let obj = canvas
    .getObjects()
    .find(
      (o) =>
        o.type === "textbox" &&
        (isSignature ? o.name === "signature" : o.name === "quote"),
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
      name, 
      width: isSignature ? 200 : canvas.getWidth() - 200, // Ancho máximo para cita y firma
      breakWords: true, // Permitir romper palabras largas
      textAlign: isSignature ? "right" : "left", // Alineación predeterminada
    });
    canvas.add(newText).setActiveObject(newText);
    canvas.renderAll();
  }
};

// 2. Modificar la función applyGlobalStyle para buscar elementos textbox

// Buscar:
const applyGlobalStyle = (type: "quote" | "signature", style: object) => {
  const canvas = canvasInstance.current;
  if (!canvas) return;
  const target = canvas
    .getObjects()
    .find(
      (o) =>
        o.type === "i-text" &&
        (type === "quote" ? o.name !== "signature" : o.name === "signature"),
    ) as fabric.IText;
  if (target) {
    target.set(style);
    canvas.renderAll();
  }
};

// Reemplazar por:
const applyGlobalStyle = (type: "quote" | "signature", style: object) => {
  const canvas = canvasInstance.current;
  if (!canvas) return;
  const target = canvas
    .getObjects()
    .find(
      (o) =>
        o.type === "textbox" &&
        (type === "quote" ? o.name === "quote" : o.name === "signature"),
    ) as fabric.Textbox;
  if (target) {
    target.set(style);
    canvas.renderAll();
  }
};

// 3. Modificar la función toggleTextStyle para trabajar con textbox en lugar de i-text

// Buscar:
const toggleTextStyle = (style: string, value: any) => {
  const canvas = canvasInstance.current;
  const active = canvas?.getActiveObject();
  if (!canvas || !active || active.type !== "i-text") return;
  const itext = active as fabric.IText;
  const start = itext.selectionStart || 0;
  const end = itext.selectionEnd || 0;
  if (start === end) return;

  for (let i = start; i < end; i++) {
    const current = itext.getSelectionStyles(i)[0] || {};
    const applied = current?.[style] === value;
    const newStyle = { ...current };
    if (applied) delete newStyle[style];
    else newStyle[style] = value;
    itext.setSelectionStyles(newStyle, i, i + 1);
  }
  canvas.renderAll();
};

// Reemplazar por:
const toggleTextStyle = (style: string, value: any) => {
  const canvas = canvasInstance.current;
  const active = canvas?.getActiveObject();
  if (!canvas || !active || (active.type !== "textbox" && active.type !== "i-text")) return;

  // Trabajar tanto con IText como con Textbox
  const textObj = active as fabric.Textbox | fabric.IText;
  const start = textObj.selectionStart || 0;
  const end = textObj.selectionEnd || 0;
  if (start === end) return;

  for (let i = start; i < end; i++) {
    const current = textObj.getSelectionStyles(i)[0] || {};
    const applied = current?.[style] === value;
    const newStyle = { ...current };
    if (applied) delete newStyle[style];
    else newStyle[style] = value;
    textObj.setSelectionStyles(newStyle, i, i + 1);
  }
  canvas.renderAll();
};